// workers/gtfs-score-cron/index.js
// ── Runs daily at 6am UTC ─────────────────────────────────────────────────────
// 1. Downloads each city's GTFS static zip
// 2. Computes frequency + coverage scores
// 3. Builds chunked graph and writes to KV for routing

import { CITIES, BOUNDS, normalize } from '../../shared/cities.js';
import { buildAndStoreGraph, parseCSV, parseCSVSafe, extractFileFromZip } from '../../shared/graph-builder.js';

export default {
  async scheduled(event, env, ctx) {
    console.log('gtfs-score-cron: starting', new Date().toISOString());

    const results = [];

    for (const city of CITIES) {
      try {
        console.log(`Processing: ${city.name}`);

        // Fetch GTFS zip once — reuse for both scoring and graph building
        const zip = await fetchGTFSZip(city.gtfs_static);

        // 1. Compute frequency + coverage scores
        const scores = await processCityGTFS(zip);

        // 2. Build and store chunked routing graph
        console.log(`Building graph: ${city.name}`);
        const graphStats = await buildAndStoreGraph(city.id, zip, env.TRANSIT_KV);
        console.log(`Graph built: ${city.name}`, graphStats);

        // 3. Merge with existing pain data in KV
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
          graph_chunks:         graphStats.chunk_count,
          graph_edges:          graphStats.edge_count,
          gtfs_computed_at:     new Date().toISOString(),
        };

        await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
        results.push({ city: city.id, status: 'ok', ...scores, ...graphStats });

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: 'error', error: err.message });
      }
    }

    await env.TRANSIT_KV.put('index:last_run', JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log('gtfs-score-cron: done', results);
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/run') {
      const cityId = url.searchParams.get('city');
      const citiesToRun = cityId
        ? CITIES.filter(c => c.id === cityId)
        : CITIES;

      const results = [];
      for (const city of citiesToRun) {
        try {
          console.log(`Processing: ${city.name}`);
          const zip = await fetchGTFSZip(city.gtfs_static);
          const scores = await processCityGTFS(zip);
          const existing = await env.TRANSIT_KV.get(`city:${city.id}`, 'json') || {};
          const record = {
            ...existing,
            id: city.id,
            name: city.name,
            state: city.state,
            rail_feed: city.rail_feed,
            frequency_score: scores.frequency_score,
            coverage_score: scores.coverage_score,
            avg_headway_minutes: scores.avg_headway_minutes,
            coverage_pct: scores.coverage_pct,
            stop_count: scores.stop_count,
            gtfs_computed_at: new Date().toISOString(),
          };
          await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
          results.push({ city: city.id, status: 'ok', ...scores });
        } catch (err) {
          results.push({ city: city.id, status: 'error', error: err.message });
        }
      }

      return new Response(JSON.stringify({ status: 'done', results }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('gtfs-score-cron — /run?city=sacramento');
  },
};

// ── GTFS Scoring ──────────────────────────────────────────────────────────────

async function processCityGTFS(zip) {
  const [stopTimes, stops, trips, calendar] = await Promise.all([
    parseCSV(zip, 'stop_times.txt'),
    parseCSV(zip, 'stops.txt'),
    parseCSV(zip, 'trips.txt'),
    parseCSVSafe(zip, 'calendar.txt'),
  ]);

  const frequency = computeFrequency(stopTimes, trips, calendar);
  const coverage  = computeCoverage(stops);

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

function computeCoverage(stops) {
  if (!stops.length) return { pct: 0, stop_count: 0 };

  const lats = stops.map(s => parseFloat(s.stop_lat)).filter(Boolean);
  const lons = stops.map(s => parseFloat(s.stop_lon)).filter(Boolean);

  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);

  const GRID_STEPS  = 40;
  const RADIUS_KM   = 0.4;
  const latStep = (maxLat - minLat) / GRID_STEPS;
  const lonStep = (maxLon - minLon) / GRID_STEPS;

  let covered = 0, total = 0;

  for (let i = 0; i <= GRID_STEPS; i++) {
    for (let j = 0; j <= GRID_STEPS; j++) {
      const lat = minLat + i * latStep;
      const lon = minLon + j * lonStep;
      total++;
      const isNear = stops.some(stop => {
        const d = haversineKm(lat, lon, parseFloat(stop.stop_lat), parseFloat(stop.stop_lon));
        return d <= RADIUS_KM;
      });
      if (isNear) covered++;
    }
  }

  return {
    pct:        Math.round((covered / total) * 1000) / 10,
    stop_count: stops.length,
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
