// workers/gtfs-score-cron/index.js
// ── Runs daily at 6am UTC ─────────────────────────────────────────────────────
// Computes frequency + coverage scores ONLY. Graph building is separate
// (run locally via build-graph-local.mjs and push to KV with wrangler).
//
// CPU budget breakdown per city:
//   - GTFS zip fetch:        ~1–3s network, 0 CPU
//   - stop_times parse:      light — only peak-hour rows kept
//   - coverage (bucket):     O(stops) instead of O(stops × grid) — ~50x faster
//   - KV write:              negligible
//
// Process one city at a time via /run?city=sacramento to stay under limits.

import { CITIES, BOUNDS, normalize } from '../../shared/cities.js';
import { parseCSV, parseCSVSafe } from '../../shared/graph-builder.js';

export default {
  async scheduled(event, env, ctx) {
    console.log('gtfs-score-cron: starting', new Date().toISOString());

    const results = [];
    for (const city of CITIES) {
      const result = await processCity(city, env);
      results.push(result);
      // Yield between cities to avoid CPU accumulation
      await sleep(100);
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
        const result = await processCity(city, env);
        results.push(result);
        await sleep(100);
      }

      return new Response(JSON.stringify({ status: 'done', results }, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    return new Response(
      'gtfs-score-cron\n\nEndpoints:\n  /run              — all cities\n  /run?city=sacramento — single city'
    );
  },
};

// ── Per-city processing ───────────────────────────────────────────────────────

async function processCity(city, env) {
  if (!city.gtfs_static) {
    console.log(`Skipping: ${city.name} (no gtfs_static — data seeded manually)`);
    return { city: city.id, status: 'skipped', reason: 'no gtfs_static' };
  }

  try {
    console.log(`Processing: ${city.name}`);

    const zip = await fetchGTFSZip(city.gtfs_static);
    const scores = await processCityGTFS(zip);

    // Merge with existing KV record — preserve pain factor data if present
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

    // Recompute composite score if pain data already exists
    if (existing.pain_factor != null) {
      const { computeScore } = await import('../../shared/cities.js');
      record.score = computeScore(
        scores.avg_headway_minutes,
        scores.coverage_pct,
        existing.pain_factor,
      );
    }

    await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
    console.log(`Done: ${city.name}`, scores);
    return { city: city.id, status: 'ok', ...scores };

  } catch (err) {
    console.error(`Failed: ${city.name}`, err.message);
    return { city: city.id, status: 'error', error: err.message };
  }
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
  const coverage  = computeCoverage(stops);

  return {
    avg_headway_minutes:  frequency.avg_headway,
    peak_headway_minutes: frequency.peak_headway,
    frequency_score:      normalize(frequency.avg_headway, { best: 5, worst: 45 }, 'lower_better'),
    coverage_pct:         coverage.pct,
    stop_count:           coverage.stop_count,
    coverage_score:       normalize(coverage.pct, { best: 90, worst: 10 }, 'higher_better'),
  };
}

// ── Frequency ─────────────────────────────────────────────────────────────────

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
    if (calendar && weekdayServices.size > 0 && !weekdayServices.has(serviceId)) return;

    const secs = timeToSeconds(st.arrival_time);
    // Only AM peak (7–9am) and PM peak (4–7pm)
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

  if (!headways.length) return { avg_headway: 45, peak_headway: 45 };

  return {
    avg_headway:  Math.round((headways.reduce((a, b) => a + b, 0) / headways.length) * 10) / 10,
    peak_headway: Math.round(Math.min(...headways) * 10) / 10,
  };
}

// ── Coverage (bucket-based, O(stops) not O(stops × grid)) ────────────────────
//
// Old approach: for each grid cell, scan all stops to find the nearest one.
// That's O(GRID² × stops) = ~5M ops for Sacramento. Kills CPU budget.
//
// New approach: hash each stop into a lat/lon bucket. For each grid cell,
// only check stops in adjacent buckets. Worst case O(stops × nearby_buckets)
// where nearby_buckets is ~9. ~50x faster.

function computeCoverage(stops) {
  if (!stops.length) return { pct: 0, stop_count: 0 };

  const RADIUS_KM  = 0.4;
  const GRID_STEPS = 40;

  // Parse stops once
  const parsed = stops
    .map(s => ({ lat: parseFloat(s.stop_lat), lon: parseFloat(s.stop_lon) }))
    .filter(s => !isNaN(s.lat) && !isNaN(s.lon));

  if (!parsed.length) return { pct: 0, stop_count: 0 };

  const lats = parsed.map(s => s.lat);
  const lons = parsed.map(s => s.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);

  const latRange = maxLat - minLat || 0.01;
  const lonRange = maxLon - minLon || 0.01;

  // ── Build spatial bucket map ──
  // Bucket size slightly larger than radius so adjacent buckets always cover overlap
  const LAT_DEG_PER_KM = 1 / 111;
  const LON_DEG_PER_KM = 1 / (111 * Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180));
  const bucketLatSize  = RADIUS_KM * LAT_DEG_PER_KM;
  const bucketLonSize  = RADIUS_KM * LON_DEG_PER_KM;

  const buckets = new Map();
  parsed.forEach(stop => {
    const bLat = Math.floor((stop.lat - minLat) / bucketLatSize);
    const bLon = Math.floor((stop.lon - minLon) / bucketLonSize);
    const key  = `${bLat},${bLon}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(stop);
  });

  // ── Grid evaluation ──
  const latStep = latRange / GRID_STEPS;
  const lonStep = lonRange / GRID_STEPS;
  let covered = 0;
  const total = (GRID_STEPS + 1) * (GRID_STEPS + 1);

  for (let i = 0; i <= GRID_STEPS; i++) {
    for (let j = 0; j <= GRID_STEPS; j++) {
      const lat = minLat + i * latStep;
      const lon = minLon + j * lonStep;

      const bLat = Math.floor((lat - minLat) / bucketLatSize);
      const bLon = Math.floor((lon - minLon) / bucketLonSize);

      // Check this bucket and 8 neighbors
      let isNear = false;
      outer: for (let db = -1; db <= 1; db++) {
        for (let dc = -1; dc <= 1; dc++) {
          const neighbors = buckets.get(`${bLat + db},${bLon + dc}`);
          if (!neighbors) continue;
          for (const stop of neighbors) {
            if (haversineKm(lat, lon, stop.lat, stop.lon) <= RADIUS_KM) {
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
    stop_count: parsed.length,
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

const sleep = ms => new Promise(r => setTimeout(r, ms));
