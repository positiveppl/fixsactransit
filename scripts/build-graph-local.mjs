#!/usr/bin/env node
// scripts/build-graph-local.mjs
// ── Builds transit graph locally and pushes chunks to Cloudflare KV ──────────
// Run: node scripts/build-graph-local.mjs sacramento
//
// Reads GTFS zip from /tmp/{city}-gtfs.zip
// Writes graph chunks to KV via: wrangler kv key put

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

const cityId   = process.argv[2];
if (!cityId) { console.error('Usage: node build-graph-local.mjs <cityId>'); process.exit(1); }

const KV_NAMESPACE_ID = 'aac52192fcae4d898c2eb6d25ea8f644';
const GTFS_ZIP_PATH   = `/tmp/${cityId}-gtfs.zip`;
const TMP_DIR         = `/tmp/graph-${cityId}`;

const CHUNK_SIZE     = 500;
const WALK_SPEED_MPS = 1.33;
const MAX_WALK_M     = 400;

console.log(`\nBuilding graph for: ${cityId}`);
console.log(`Reading: ${GTFS_ZIP_PATH}\n`);

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(TMP_DIR, { recursive: true });

  // Extract GTFS files we need
  console.log('Extracting GTFS files...');
  extractFromZip(GTFS_ZIP_PATH, TMP_DIR, [
    'stops.txt', 'stop_times.txt', 'trips.txt', 'routes.txt', 'transfers.txt'
  ]);

  // Parse
  console.log('Parsing stops...');
  const stops     = parseCSV(readFile('stops.txt'));
  console.log(`  ${stops.length} stops`);

  console.log('Parsing trips...');
  const trips     = parseCSV(readFile('trips.txt'));

  console.log('Parsing routes...');
  const routes    = parseCSV(readFile('routes.txt'));

  console.log('Parsing stop_times (this may take a moment)...');
  const stopTimes = parseCSV(readFile('stop_times.txt'));
  console.log(`  ${stopTimes.length} stop_times`);

  const transfers = safeReadFile('transfers.txt') ? parseCSV(safeReadFile('transfers.txt')) : [];

  // Build lookups
  const stopMap      = buildStopMap(stops);
  const tripRouteMap = {};
  trips.forEach(t => { tripRouteMap[t.trip_id] = t.route_id; });
  const routeTypeMap = {};
  routes.forEach(r => { routeTypeMap[r.route_id] = parseInt(r.route_type); });

  // Build edges
  console.log('\nBuilding transit edges...');
  const edges = [];
  buildTransitEdges(edges, groupTripStops(stopTimes), tripRouteMap, routeTypeMap);
  console.log(`  ${edges.length} transit edges`);

  console.log('Building walking edges...');
  buildWalkingEdges(edges, stopMap);
  console.log(`  ${edges.length} total edges (including walks)`);

  if (transfers.length) {
    buildExplicitTransfers(edges, transfers, stopMap);
    console.log(`  ${edges.length} total edges (including transfers)`);
  }

  // Chunk
  console.log('\nChunking graph...');
  const stopIds  = Object.keys(stopMap);
  const chunkMap = assignChunks(stopIds, CHUNK_SIZE);
  const chunks   = buildChunks(edges, chunkMap);
  const chunkCount = Object.keys(chunks).length;
  console.log(`  ${chunkCount} chunks`);

  // Build route trips
  const tripStops  = groupTripStops(stopTimes);
  const routeTrips = groupRouteTrips(tripStops, tripRouteMap);

  // Write to KV
  console.log('\nPushing to Cloudflare KV...');

  // Enrich stops with their chunk ID
for (const [stopId, chunkId] of Object.entries(chunkMap)) {
  if (stopMap[stopId]) stopMap[stopId].chunk = chunkId;
}
  
  // stops:{city}
  kvPut(`stops:${cityId}`, JSON.stringify(stopMap));
  console.log(`  ✓ stops:${cityId}`);

  // meta:{city}
  const meta = {
    chunk_count:  chunkCount,
    stop_count:   stopIds.length,
    route_count:  Object.keys(routeTrips).length,
    edge_count:   edges.length,
    built_at:     new Date().toISOString(),
  };
  kvPut(`meta:${cityId}`, JSON.stringify(meta));
  console.log(`  ✓ meta:${cityId}`);

  // graph chunks
  for (const [chunkId, chunkEdges] of Object.entries(chunks)) {
    kvPut(`graph:${cityId}:chunk:${chunkId}`, JSON.stringify(chunkEdges));
    process.stdout.write(`  ✓ graph:${cityId}:chunk:${chunkId} (${chunkEdges.length} edges)\n`);
  }

  // trips per route (sample — top 50 routes by trip count)
  const routeIds = Object.keys(routeTrips).slice(0, 50);
  for (const routeId of routeIds) {
    const safeId = routeId.replace(/[^a-zA-Z0-9_-]/g, '_');
    kvPut(`trips:${cityId}:${safeId}`, JSON.stringify(routeTrips[routeId]));
  }
  console.log(`  ✓ trips:${cityId}:* (${routeIds.length} routes)`);

  console.log(`\n✅ Graph for ${cityId} pushed to KV`);
  console.log(`   Stops:  ${stopIds.length}`);
  console.log(`   Edges:  ${edges.length}`);
  console.log(`   Chunks: ${chunkCount}`);
  console.log(`\nNow run:`);
  console.log(`  curl "https://pain-factor-cron.msgpnn.workers.dev/test/${cityId}"`);
}

// ── KV write via wrangler CLI ─────────────────────────────────────────────────

function kvPut(key, filePath) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execSync(`npx wrangler kv key put --remote --namespace-id=${KV_NAMESPACE_ID} "${key}" --path="${filePath}"`, { stdio: 'inherit' });
      return;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(`  ⚠ Retry ${attempt}/3 for ${key}...`);
      execSync('sleep 2');
    }
  }
}

// ── File helpers ──────────────────────────────────────────────────────────────

function readFile(filename) {
  return readFileSync(path.join(TMP_DIR, filename), 'utf8');
}

function safeReadFile(filename) {
  try { return readFileSync(path.join(TMP_DIR, filename), 'utf8'); }
  catch { return null; }
}

function extractFromZip(zipPath, outDir, files) {
  files.forEach(f => {
    try {
      execSync(`unzip -o "${zipPath}" "${f}" -d "${outDir}"`, { stdio: 'pipe' });
    } catch {
      // File may not exist in this zip — ok
    }
  });
}

// ── Graph building (same logic as graph-builder.js) ──────────────────────────

function buildStopMap(stops) {
  const map = {};
  stops.forEach(s => {
    const lat = parseFloat(s.stop_lat);
    const lon = parseFloat(s.stop_lon);
    if (!s.stop_id || isNaN(lat) || isNaN(lon)) return;
    map[s.stop_id] = { lat, lon, name: s.stop_name || s.stop_id };
  });
  return map;
}

function groupTripStops(stopTimes) {
  const trips = {};
  stopTimes.forEach(st => {
    if (!trips[st.trip_id]) trips[st.trip_id] = [];
    trips[st.trip_id].push(st);
  });
  for (const id of Object.keys(trips)) {
    trips[id].sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
  }
  return trips;
}

function buildTransitEdges(edges, tripStops, tripRouteMap, routeTypeMap) {
  for (const [tripId, stops] of Object.entries(tripStops)) {
    const routeId   = tripRouteMap[tripId];
    const routeType = routeTypeMap[routeId] ?? 3;
    const mode      = routeType <= 2 ? 'rail' : 'bus';

    for (let i = 0; i < stops.length - 1; i++) {
      const from      = stops[i];
      const to        = stops[i + 1];
      const departSec = timeToSeconds(from.departure_time || from.arrival_time);
      const arriveSec = timeToSeconds(to.arrival_time   || to.departure_time);

      if (isNaN(departSec) || isNaN(arriveSec) || arriveSec <= departSec) continue;

      edges.push({
        type:   mode,
        from:   from.stop_id,
        to:     to.stop_id,
        route:  routeId,
        trip:   tripId,
        depart: departSec,
        arrive: arriveSec,
      });
    }
  }
}

function buildWalkingEdges(edges, stopMap) {
  const list = Object.entries(stopMap);
  for (let i = 0; i < list.length; i++) {
    const [idA, stopA] = list[i];
    for (let j = i + 1; j < list.length; j++) {
      const [idB, stopB] = list[j];
      const distM = haversineMeters(stopA.lat, stopA.lon, stopB.lat, stopB.lon);
      if (distM > MAX_WALK_M) continue;
      const walkSec = Math.round(distM / WALK_SPEED_MPS);
      edges.push({ type: 'walk', from: idA, to: idB, duration: walkSec, distance: Math.round(distM) });
      edges.push({ type: 'walk', from: idB, to: idA, duration: walkSec, distance: Math.round(distM) });
    }
  }
}

function buildExplicitTransfers(edges, transfers, stopMap) {
  transfers.forEach(t => {
    if (!stopMap[t.from_stop_id] || !stopMap[t.to_stop_id]) return;
    const minSec = parseInt(t.transfer_type) === 2 ? parseInt(t.min_transfer_time) || 120 : 120;
    edges.push({ type: 'transfer', from: t.from_stop_id, to: t.to_stop_id, duration: minSec });
  });
}

function assignChunks(stopIds, chunkSize) {
  const map        = {};
  const chunkCount = Math.ceil(stopIds.length / chunkSize);
  stopIds.forEach(id => {
    let hash = 5381;
    for (const ch of id) hash = ((hash * 33) ^ ch.charCodeAt(0)) >>> 0;
    map[id] = hash % chunkCount;
  });
  return map;
}

function buildChunks(edges, chunkMap) {
  const chunks = {};
  edges.forEach(edge => {
    const c = chunkMap[edge.from];
    if (c === undefined) return;
    if (!chunks[c]) chunks[c] = [];
    chunks[c].push(edge);
  });
  return chunks;
}

function groupRouteTrips(tripStops, tripRouteMap) {
  const routeTrips = {};
  for (const [tripId, stops] of Object.entries(tripStops)) {
    const routeId = tripRouteMap[tripId];
    if (!routeId) continue;
    if (!routeTrips[routeId]) routeTrips[routeId] = [];
    routeTrips[routeId].push({ tripId, stops });
  }
  return routeTrips;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function timeToSeconds(t) {
  if (!t) return NaN;
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R    = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseCSV(text) {
  const lines   = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].replace(/\r/g, '').split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line.replace(/\r/g, ''));
    const obj  = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').replace(/^"|"$/g, '').trim(); });
    return obj;
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = '', inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(current); current = ''; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

main().catch(err => { console.error('\n❌ Error:', err.message); process.exit(1); });
