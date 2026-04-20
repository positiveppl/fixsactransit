#!/usr/bin/env node
// scripts/reseed-static-cities.mjs
// Recomputes GTFS scores locally for cities blocked by Workers, pushes to KV.
//
// Coverage metric: stops per sq km of city urban area.
// This is honest, stable, and not broken by bounding box issues.
// Source for urban areas: US Census Bureau urbanized area data.
//
// Usage:
//   node scripts/reseed-static-cities.mjs              # all cities
//   node scripts/reseed-static-cities.mjs --city=san_diego

import { execSync } from 'child_process';
import { rmSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const KV_NAMESPACE_ID = 'aac52192fcae4d898c2eb6d25ea8f644';

// Urban area sq km — US Census Bureau urbanized area boundaries
// These are the actual developed urban footprints, not city limits
const URBAN_AREA_KM2 = {
  san_francisco: 121,   // SF proper (dense 7x7 miles)
  los_angeles:   1302,  // LA city limits
  san_diego:     964,   // SD city limits
  san_jose:      467,   // SJ city limits
  sacramento:    680,   // Sacramento city limits
};

const STATIC_CITIES = [
  {
    id: 'san_francisco',
    name: 'San Francisco',
    state: 'CA',
    rail_feed: true,
    // Get free key at 511.org/open-data/transit — replace YOUR_511_KEY
    gtfs_url: 'https://api.511.org/transit/datafeeds?api_key=31152551-eb0b-43df-b5fb-627c6546d3e5&operator_id=SF',
    trip: { origin: '37.7599,-122.4148', destination: '37.7946,-122.3999' },
  },
  {
    id: 'los_angeles',
    name: 'Los Angeles',
    state: 'CA',
    rail_feed: true,
    gtfs_url: 'https://gitlab.com/LACMTA/gtfs_bus/raw/master/gtfs_bus.zip',
    trip: { origin: '34.0870,-118.2712', destination: '34.0522,-118.2437' },
  },
  {
    id: 'san_diego',
    name: 'San Diego',
    state: 'CA',
    rail_feed: true,
    gtfs_url: 'https://www.sdmts.com/google_transit_files/google_transit.zip',
    trip: { origin: '32.7479,-117.1294', destination: '32.7157,-117.1611' },
  },
  {
    id: 'san_jose',
    name: 'San Jose',
    state: 'CA',
    rail_feed: false,
    gtfs_url: 'https://gtfs.vta.org/gtfs_vta.zip',
    trip: { origin: '37.3031,-121.9019', destination: '37.3382,-121.8863' },
  },
];

// ── Scoring bounds ────────────────────────────────────────────────────────────
// Coverage: stops per sq km
//   best: 25/km² (SF-level density)
//   worst: 2/km² (very sparse)
const BOUNDS = {
  headway:  { best: 5,  worst: 45 },
  coverage: { best: 25, worst: 2  },  // stops/km²
  pain:     { best: 1,  worst: 8  },
};

function normalize(value, bounds, direction = 'lower_better') {
  const { best, worst } = bounds;
  const clamped = Math.max(Math.min(value, worst), best);
  const ratio = direction === 'lower_better'
    ? (worst - clamped) / (worst - best)
    : (clamped - worst) / (best - worst);
  return Math.round(ratio * 100) / 10;
}

function computeScore(avgHeadway, stopsPerKm2, painFactor) {
  return (
    normalize(avgHeadway,  BOUNDS.headway,  'lower_better')  * 0.40 +
    normalize(stopsPerKm2, BOUNDS.coverage, 'higher_better') * 0.30 +
    normalize(painFactor,  BOUNDS.pain,     'lower_better')  * 0.30
  ).toFixed(1);
}

// ── Download ──────────────────────────────────────────────────────────────────

async function downloadZip(url, destPath) {
  console.log(`  Downloading ${url}...`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'fixsactransit.org/1.0 (local reseed script)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  await writeFile(destPath, Buffer.from(buf));
  console.log(`  Downloaded ${(buf.byteLength / 1024 / 1024).toFixed(1)}MB`);
}

// ── CSV parsing ───────────────────────────────────────────────────────────────

function parseCSVText(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = lines[i].split(',');
    const row = {};
    headers.forEach((h, j) => { row[h] = (vals[j] || '').trim().replace(/^"|"$/g, ''); });
    rows.push(row);
  }
  return rows;
}

// ── Frequency scoring ─────────────────────────────────────────────────────────

function timeToSeconds(t) {
  if (!t) return 0;
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function scoreFrequency(stopTimes, trips, calendar) {
  const weekdayServices = new Set(
    (calendar || [])
      .filter(r => r.monday === '1' || r.tuesday === '1' || r.wednesday === '1')
      .map(r => r.service_id)
  );
  const tripService = {};
  trips.forEach(t => { tripService[t.trip_id] = t.service_id; });

  const peakArrivals = {};
  stopTimes.forEach(st => {
    const svcId = tripService[st.trip_id];
    if (calendar?.length && weekdayServices.size > 0 && !weekdayServices.has(svcId)) return;
    const secs = timeToSeconds(st.arrival_time);
    const inPeak = (secs >= 7*3600 && secs <= 9*3600) || (secs >= 16*3600 && secs <= 19*3600);
    if (!inPeak) return;
    if (!peakArrivals[st.stop_id]) peakArrivals[st.stop_id] = [];
    peakArrivals[st.stop_id].push(secs);
  });

  const headways = [];
  Object.values(peakArrivals).forEach(arrivals => {
    if (arrivals.length < 2) return;
    arrivals.sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < arrivals.length; i++) {
      const gap = (arrivals[i] - arrivals[i-1]) / 60;
      if (gap > 0 && gap < 120) gaps.push(gap);
    }
    if (gaps.length) headways.push(gaps.reduce((a,b) => a+b, 0) / gaps.length);
  });

  if (!headways.length) return { avg_headway: 45, peak_headway: 45 };
  return {
    avg_headway:  Math.round(headways.reduce((a,b) => a+b, 0) / headways.length * 10) / 10,
    peak_headway: Math.round(Math.min(...headways) * 10) / 10,
  };
}

// ── Coverage: stops per sq km ─────────────────────────────────────────────────

function scoreCoverage(stops, cityId) {
  const validStops = stops.filter(s => {
    const lat = parseFloat(s.stop_lat);
    const lon = parseFloat(s.stop_lon);
    return !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0;
  });

  const urbanAreaKm2 = URBAN_AREA_KM2[cityId];
  if (!urbanAreaKm2) throw new Error(`No urban area defined for ${cityId}`);

  const stopsPerKm2 = Math.round((validStops.length / urbanAreaKm2) * 100) / 100;
  return {
    stops_per_km2: stopsPerKm2,
    stop_count: validStops.length,
    urban_area_km2: urbanAreaKm2,
  };
}

// ── KV helpers ────────────────────────────────────────────────────────────────

function kvGet(key) {
  try {
    const result = execSync(
      `npx wrangler kv key get "${key}" --namespace-id=${KV_NAMESPACE_ID} --remote 2>/dev/null`,
      { encoding: 'utf8' }
    ).trim();
    return JSON.parse(result);
  } catch { return null; }
}

async function kvPut(key, value) {
  const tmpFile = join(tmpdir(), `kv-${Date.now()}.json`);
  await writeFile(tmpFile, JSON.stringify(value, null, 2));
  execSync(
    `npx wrangler kv key put "${key}" --path="${tmpFile}" --namespace-id=${KV_NAMESPACE_ID} --remote`,
    { stdio: 'inherit' }
  );
  await unlink(tmpFile);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const cityArg = process.argv.find(a => a.startsWith('--city='))?.split('=')[1];
const citiesToRun = cityArg
  ? STATIC_CITIES.filter(c => c.id === cityArg)
  : STATIC_CITIES;

if (!citiesToRun.length) {
  console.error(`Unknown city: ${cityArg}\nOptions: ${STATIC_CITIES.map(c => c.id).join(', ')}`);
  process.exit(1);
}

console.log(`\nReseeding ${citiesToRun.length} city/cities...\n`);
console.log('Coverage method: stops per sq km (urban area)\n');

for (const city of citiesToRun) {
  console.log(`── ${city.name} ──`);
  const zipPath  = join(tmpdir(), `${city.id}-gtfs.zip`);
  const unzipDir = join(tmpdir(), `${city.id}-gtfs`);

  try {
    await downloadZip(city.gtfs_url, zipPath);

    console.log('  Extracting zip...');
    if (existsSync(unzipDir)) rmSync(unzipDir, { recursive: true });
    mkdirSync(unzipDir, { recursive: true });
    execSync(`unzip -o "${zipPath}" -d "${unzipDir}"`, { stdio: 'pipe' });

    const findFile = (name) => {
      try {
        const found = execSync(`find "${unzipDir}" -name "${name}" | head -1`, { encoding: 'utf8' }).trim();
        if (!found) return null;
        return parseCSVText(readFileSync(found, 'utf8'));
      } catch { return null; }
    };

    console.log('  Parsing GTFS files...');
    const stopTimes = findFile('stop_times.txt');
    if (!stopTimes) throw new Error('stop_times.txt not found after extraction');

    const stops    = findFile('stops.txt')    || [];
    const trips    = findFile('trips.txt')    || [];
    const calendar = findFile('calendar.txt') || [];

    console.log(`  Stops: ${stops.length}, Trips: ${trips.length}, Stop times: ${stopTimes.length}`);

    console.log('  Computing frequency...');
    const freq = scoreFrequency(stopTimes, trips, calendar);

    console.log('  Computing coverage (stops/km²)...');
    const cov = scoreCoverage(stops, city.id);

    const freqScore = normalize(freq.avg_headway,   BOUNDS.headway,  'lower_better');
    const covScore  = normalize(cov.stops_per_km2,  BOUNDS.coverage, 'higher_better');

    console.log(`  Headway: ${freq.avg_headway}min → frequency_score: ${freqScore}`);
    console.log(`  Stops/km²: ${cov.stops_per_km2} (${cov.stop_count} stops / ${cov.urban_area_km2}km²) → coverage_score: ${covScore}`);

    const existing = kvGet(`city:${city.id}`) || {};
    const painFactor = existing.pain_factor ?? null;

    const record = {
      ...existing,
      id:                   city.id,
      name:                 city.name,
      state:                city.state,
      rail_feed:            city.rail_feed,
      frequency_score:      freqScore,
      coverage_score:       covScore,
      avg_headway_minutes:  freq.avg_headway,
      peak_headway_minutes: freq.peak_headway,
      stops_per_km2:        cov.stops_per_km2,
      stop_count:           cov.stop_count,
      urban_area_km2:       cov.urban_area_km2,
      // Keep coverage_pct for backward compat but mark it as deprecated
      coverage_pct:         cov.stops_per_km2,
      gtfs_computed_at:     new Date().toISOString(),
    };

    if (painFactor != null) {
      record.score = computeScore(freq.avg_headway, cov.stops_per_km2, painFactor);
      console.log(`  Pain: ${painFactor}× (from KV) → composite score: ${record.score}`);
    } else {
      console.log('  No pain factor in KV — composite score not updated');
    }

    console.log('  Writing to KV...');
    await kvPut(`city:${city.id}`, record);
    console.log(`  ✓ ${city.name} done\n`);

  } catch (err) {
    console.error(`  ✗ ${city.name} failed: ${err.message}\n`);
  } finally {
    if (existsSync(zipPath))  rmSync(zipPath);
    if (existsSync(unzipDir)) rmSync(unzipDir, { recursive: true });
  }
}

console.log('Done. Verify:');
console.log('  curl "https://api-gateway.msgpnn.workers.dev/api/scores" | python3 -m json.tool | grep -E \'"name"|"score"|"stops_per_km"\'');
