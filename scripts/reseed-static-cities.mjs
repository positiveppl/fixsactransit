#!/usr/bin/env node
// scripts/reseed-static-cities.mjs
// Recomputes GTFS scores locally for cities blocked by Workers, pushes to KV.
//
// Usage:
//   node scripts/reseed-static-cities.mjs              # all cities
//   node scripts/reseed-static-cities.mjs --city=san_diego

import { execSync, execFileSync } from 'child_process';
import { rmSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { writeFile, unlink, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const KV_NAMESPACE_ID = 'aac52192fcae4d898c2eb6d25ea8f644';

const STATIC_CITIES = [
  {
    id: 'san_francisco',
    name: 'San Francisco',
    state: 'CA',
    rail_feed: true,
    // Replace YOUR_511_KEY with your actual key from 511.org/open-data/transit
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

const BOUNDS = {
  headway:  { best: 5,  worst: 45 },
  coverage: { best: 90, worst: 10 },
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

function computeScore(avgHeadway, coveragePct, painFactor) {
  return (
    normalize(avgHeadway,  BOUNDS.headway,  'lower_better')  * 0.40 +
    normalize(coveragePct, BOUNDS.coverage, 'higher_better') * 0.30 +
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

// ── Scoring ───────────────────────────────────────────────────────────────────

function timeToSeconds(t) {
  if (!t) return 0;
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

function scoreCoverage(stops) {
  const RADIUS_KM = 0.4, GRID_STEPS = 40;
  const parsed = stops
    .map(s => ({ lat: parseFloat(s.stop_lat), lon: parseFloat(s.stop_lon) }))
    .filter(s => !isNaN(s.lat) && !isNaN(s.lon));
  if (!parsed.length) return { pct: 0, stop_count: 0 };

  const lats = parsed.map(s => s.lat), lons = parsed.map(s => s.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const latRange = maxLat - minLat || 0.01, lonRange = maxLon - minLon || 0.01;
  const midLat = (minLat + maxLat) / 2;
  const bucketLatSize = RADIUS_KM / 111;
  const bucketLonSize = RADIUS_KM / (111 * Math.cos(midLat * Math.PI / 180));

  const buckets = new Map();
  parsed.forEach(s => {
    const key = `${Math.floor((s.lat - minLat) / bucketLatSize)},${Math.floor((s.lon - minLon) / bucketLonSize)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(s);
  });

  const latStep = latRange / GRID_STEPS, lonStep = lonRange / GRID_STEPS;
  let covered = 0;
  const total = (GRID_STEPS + 1) ** 2;

  for (let i = 0; i <= GRID_STEPS; i++) {
    for (let j = 0; j <= GRID_STEPS; j++) {
      const lat = minLat + i * latStep, lon = minLon + j * lonStep;
      const bLat = Math.floor((lat - minLat) / bucketLatSize);
      const bLon = Math.floor((lon - minLon) / bucketLonSize);
      let isNear = false;
      outer: for (let db = -1; db <= 1; db++) {
        for (let dc = -1; dc <= 1; dc++) {
          const neighbors = buckets.get(`${bLat+db},${bLon+dc}`);
          if (!neighbors) continue;
          for (const s of neighbors) {
            if (haversineKm(lat, lon, s.lat, s.lon) <= RADIUS_KM) { isNear = true; break outer; }
          }
        }
      }
      if (isNear) covered++;
    }
  }

  return { pct: Math.round(covered / total * 1000) / 10, stop_count: parsed.length };
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

for (const city of citiesToRun) {
  console.log(`── ${city.name} ──`);
  const zipPath  = join(tmpdir(), `${city.id}-gtfs.zip`);
  const unzipDir = join(tmpdir(), `${city.id}-gtfs`);

  try {
    await downloadZip(city.gtfs_url, zipPath);

    // Use system unzip — handles all zip variants correctly
    console.log('  Extracting zip...');
    if (existsSync(unzipDir)) rmSync(unzipDir, { recursive: true });
    mkdirSync(unzipDir, { recursive: true });
    execSync(`unzip -o "${zipPath}" -d "${unzipDir}"`, { stdio: 'pipe' });

    // Find files anywhere inside the extracted dir (handles subdirectory layouts)
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

    console.log('  Computing coverage...');
    const cov = scoreCoverage(stops);

    const freqScore = normalize(freq.avg_headway, BOUNDS.headway,  'lower_better');
    const covScore  = normalize(cov.pct,          BOUNDS.coverage, 'higher_better');

    console.log(`  Headway: ${freq.avg_headway}min → frequency_score: ${freqScore}`);
    console.log(`  Coverage: ${cov.pct}% → coverage_score: ${covScore}`);

    // Preserve existing pain factor from KV
    console.log('  Fetching existing KV record...');
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
      coverage_pct:         cov.pct,
      stop_count:           cov.stop_count,
      gtfs_computed_at:     new Date().toISOString(),
    };

    if (painFactor != null) {
      record.score = computeScore(freq.avg_headway, cov.pct, painFactor);
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
console.log('  curl "https://api-gateway.msgpnn.workers.dev/api/scores" | python3 -m json.tool | grep -E \'"name"|"score"\'');
