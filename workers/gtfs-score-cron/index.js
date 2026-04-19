// workers/gtfs-score-cron/index.js
// ── Runs daily at 6am UTC ─────────────────────────────────────────────────────
// 1. Downloads each city's GTFS static zip
// 2. Computes frequency + coverage scores
// 3. Writes scores to KV
//
// NOTE: Graph building moved to a separate /build-graph endpoint to avoid
// CPU timeouts. Run it after scores are confirmed working.

import { CITIES, BOUNDS, normalize } from '../../shared/cities.js';
import { parseCSV, parseCSVSafe, extractFileFromZip } from '../../shared/graph-builder.js';
import { buildAndStoreGraph, parseCSV, parseCSVSafe, extractFileFromZip } from '../../shared/graph-builder.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/run') {
      const cityId = url.searchParams.get('city');
      const citiesToRun = cityId
        ? CITIES.filter(c => c.id === cityId)
        : CITIES;

      const results = await runScoring(citiesToRun, env);
      return new Response(JSON.stringify({ status: 'done', results }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/build-graph') {
      const cityId = url.searchParams.get('city') || 'sacramento';
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return new Response('City not found', { status: 404 });

      try {
        const zip = await fetchGTFSZip(city.gtfs_static);
        const graphStats = await buildAndStoreGraph(city.id, zip, env.TRANSIT_KV);
        return new Response(JSON.stringify({ status: 'ok', ...graphStats }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: 'error', error: err.message }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('gtfs-score-cron\n\nEndpoints:\n  /run\n  /run?city=sacramento\n  /build-graph?city=sacramento');
  },

// ── Core scoring loop ─────────────────────────────────────────────────────────

async function runScoring(cities, env) {
  const results = [];

  for (const city of cities) {
    try {
      console.log(`Processing: ${city.name}`);
      const zip = await fetchGTFSZip(city.gtfs_static);
      const scores = await processCityGTFS(zip);

      const existing = await env.TRANSIT_KV.get(`city:${city.id}`, 'json') || {};
      const record = {
        ...existing,
        id:                   city.id,
        name:                 city.name,
        state:                city.state,
        rail_feed:            city.rail_feed,
        frequency_score:      scores.frequency_score,
        coverage_score:       scores.coverage_score,
        avg_headway_minutes:  scores.avg_headway_minutes,
        coverage_pct:         scores.coverage_pct,
        stop_count:           scores.stop_count,
        gtfs_computed_at:     new Date().toISOString(),
      };

      await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
      results.push({ city: city.id, status: 'ok', ...scores });

    } catch (err) {
      console.error(`Failed: ${city.name}`, err.message);
      results.push({ city: city.id, status: 'error', error: err.message });
    }
  }

  return results;
}

// ── GTFS Scoring ──────────────────────────────────────────────────────────────

async function processCityGTFS(zip) {
  const [stopTimes, stops, trips, calendar] = await Promise.all([
    parseCSV(zip, 'stop_times.txt'),
    parseCSV(zip, 'stops.txt'),
    parseCSV(zip, 'trips.txt'),
    parseCSVSafe(zip, 'calendar.txt'),
  ]);

  const frequency = computeFrequency(stopTimes, trips, calendar);
  const coverage  = computeCoverageFast(stops);

  return {
    avg_headway_minutes:  frequency.avg_headway,
    peak_headway_minutes: frequency.peak_headway,
    frequency_score:      normalize(frequency.avg_headway, { best: 5, worst: 60 }, 'lower_better'),
    coverage_pct:         coverage.pct,
    stop_count:           coverage.stop_count,
    coverage_score:       normalize(coverage.pct, { best: 90, worst: 20 }, 'higher_better'),
  };
}

function computeFrequency(stopTimes, trips, calendar) {
  const weekdayServices = new Set(
    (calendar || [])
      .filter(r => r.monday === '1' || r.tuesday === '1' || r.wednesday === '1')
      .map(r => r.service_id)
  );

  const tripService = {};
  trips.forEach(t => { tripService[t.trip_id] = t.service_id; });

  const peakArrivals = {};

  stopTimes.forEach(st => {
    const serviceId = tripService[st.trip_id];
    if (calendar && !weekdayServices.has(serviceId)) return;

    const secs = timeToSeconds(st.arrival_time);
    const inAMPeak = secs >= 7 * 3600 && secs <= 9 * 3600;
    const inPMPeak = secs >= 16 * 3600 && secs <= 19 * 3600;
    if (!inAMPeak && !inPMPeak) return;

    if (!peakArrivals[st.stop_id]) peakArrivals[st.stop_id] = [];
    peakArrivals[st.stop_id].push(secs);
  });

  const headways = [];
  Object.values(peakArrivals).forEach(arrivals => {
    if (arrivals.length < 2) return;
    arrivals.sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < arrivals.length; i++) {
      const gap = (arrivals[i] - arrivals[i - 1]) / 60;
      if (gap > 0 && gap < 120) gaps.push(gap);
    }
    if (gaps.length) headways.push(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  });

  if (!headways.length) return { avg_headway: 60, peak_headway: 60 };

  return {
    avg_headway:  Math.round((headways.reduce((a, b) => a + b, 0) / headways.length) * 10) / 10,
    peak_headway: Math.round(Math.min(...headways) * 10) / 10,
  };
}

// ── Fast coverage using spatial grid buckets ──────────────────────────────────
//
// Old approach: O(GRID² × stops) = ~5M haversine calls for Sacramento.
// New approach: bucket stops into 0.4km cells, then each grid point only
// checks its immediate neighboring buckets — O(GRID²) with tiny constant.

function computeCoverageFast(stops) {
  if (!stops.length) return { pct: 0, stop_count: 0 };

  const RADIUS_KM = 0.4;
  // Cell size slightly larger than radius so we only need to check adjacent cells
  const CELL_DEG_LAT = 0.004; // ~0.44km
  const CELL_DEG_LON = 0.005; // ~0.44km at Sacramento's latitude

  // Build spatial hash of stops
  const buckets = {};
  const parsedStops = [];

  for (const stop of stops) {
    const lat = parseFloat(stop.stop_lat);
    const lon = parseFloat(stop.stop_lon);
    if (!lat || !lon) continue;
    parsedStops.push({ lat, lon });

    const bLat = Math.floor(lat / CELL_DEG_LAT);
    const bLon = Math.floor(lon / CELL_DEG_LON);
    const key = `${bLat},${bLon}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push({ lat, lon });
  }

  if (!parsedStops.length) return { pct: 0, stop_count: 0 };

  const lats = parsedStops.map(s => s.lat);
  const lons = parsedStops.map(s => s.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);

  const GRID_STEPS = 30; // reduced from 40 — still accurate enough
  const latStep = (maxLat - minLat) / GRID_STEPS;
  const lonStep = (maxLon - minLon) / GRID_STEPS;

  let covered = 0, total = 0;

  for (let i = 0; i <= GRID_STEPS; i++) {
    for (let j = 0; j <= GRID_STEPS; j++) {
      const lat = minLat + i * latStep;
      const lon = minLon + j * lonStep;
      total++;

      // Only check stops in neighboring buckets (3x3 = 9 buckets max)
      const bLat = Math.floor(lat / CELL_DEG_LAT);
      const bLon = Math.floor(lon / CELL_DEG_LON);

      let isNear = false;
      outer: for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const neighbors = buckets[`${bLat + di},${bLon + dj}`];
          if (!neighbors) continue;
          for (const s of neighbors) {
            if (haversineKm(lat, lon, s.lat, s.lon) <= RADIUS_KM) {
              isNear = true;
              break outer;
            }
          }
        }
      }
      if (isNear) covered++;
    }
  }

  return {
    pct:        Math.round((covered / total) * 1000) / 10,
    stop_count: parsedStops.length,
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function timeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchGTFSZip(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'fixsactransit.org/1.0' },
    cf: { cacheTtl: 3600 },
  });
  if (!res.ok) throw new Error(`GTFS fetch failed: ${res.status} ${url}`);
  return res.arrayBuffer();
}
