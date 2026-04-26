#!/usr/bin/env node
// scripts/compute-pain-local.mjs
// Computes real pain factors locally for any city.
// Loads graph chunks from remote KV, runs Dijkstra locally (no memory limit).
//
// Usage:
//   node scripts/compute-pain-local.mjs san_diego
//   node scripts/compute-pain-local.mjs los_angeles
//   node scripts/compute-pain-local.mjs san_francisco
//   node scripts/compute-pain-local.mjs san_jose
//   node scripts/compute-pain-local.mjs sacramento

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const KV_NAMESPACE_ID = 'aac52192fcae4d898c2eb6d25ea8f644';

const CITIES = {
  san_francisco: {
    name: 'San Francisco', state: 'CA', rail_feed: true,
    origin:      { lat: 37.7599, lon: -122.4148 },
    destination: { lat: 37.7946, lon: -122.3999 },
  },
  los_angeles: {
    name: 'Los Angeles', state: 'CA', rail_feed: true,
    origin:      { lat: 34.0870, lon: -118.2712 },
    destination: { lat: 34.0522, lon: -118.2437 },
  },
  san_diego: {
    name: 'San Diego', state: 'CA', rail_feed: true,
    origin:      { lat: 32.7479, lon: -117.1294 },
    destination: { lat: 32.7157, lon: -117.1611 },
  },
  san_jose: {
    name: 'San Jose', state: 'CA', rail_feed: false,
    origin:      { lat: 37.3031, lon: -121.9019 },
    destination: { lat: 37.3382, lon: -121.8863 },
  },
  sacramento: {
    name: 'Sacramento', state: 'CA', rail_feed: false,
    origin:      { lat: 38.5516, lon: -121.4685 },
    destination: { lat: 38.5802, lon: -121.4931 },
  },
};

const BOUNDS = {
  headway:  { best: 5,  worst: 45 },
  pain:     { best: 1,  worst: 8  },
  coverage: { best: 25, worst: 2  },
};

function normalize(value, bounds, direction = 'lower_better') {
  const { best, worst } = bounds;
  const clamped = Math.max(Math.min(value, worst), best);
  const ratio = direction === 'lower_better'
    ? (worst - clamped) / (worst - best)
    : (clamped - worst) / (best - worst);
  return Math.round(ratio * 100) / 10;
}

// ── KV helpers ────────────────────────────────────────────────────────────────

function kvGet(key) {
  try {
    const raw = execSync(
      `npx wrangler kv key get "${key}" --namespace-id=${KV_NAMESPACE_ID} --remote 2>/dev/null`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    ).trim();
    return JSON.parse(raw);
  } catch { return null; }
}

async function kvPut(key, value) {
  const tmpFile = join(tmpdir(), `kv-pain-${Date.now()}.json`);
  writeFileSync(tmpFile, JSON.stringify(value, null, 2));
  execSync(
    `npx wrangler kv key put "${key}" --path="${tmpFile}" --namespace-id=${KV_NAMESPACE_ID} --remote`,
    { stdio: 'inherit' }
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TRANSFER_PENALTY_SEC = 300;
const MAX_WALK_TOTAL_SEC   = 1200;
const MAX_JOURNEY_SEC      = 10800;
const WALK_SPEED_MPS       = 1.33;
const DRIVE_SPEED_KMH      = 33;

// ── Geo ───────────────────────────────────────────────────────────────────────

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function findNearestStops(stopMap, lat, lon, n = 3) {
  return Object.entries(stopMap)
    .map(([id, s]) => ({ id, ...s, distM: haversineKm(lat, lon, s.lat, s.lon) * 1000 }))
    .filter(s => s.distM <= 1500)
    .sort((a, b) => a.distM - b.distM)
    .slice(0, n);
}

// ── Min-heap ──────────────────────────────────────────────────────────────────

class MinHeap {
  constructor() { this.h = []; }
  push(item) {
    this.h.push(item);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = Math.floor((i-1)/2);
      if (this.h[p].cost <= this.h[i].cost) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length > 0) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let s = i, l = 2*i+1, r = 2*i+2;
        if (l < this.h.length && this.h[l].cost < this.h[s].cost) s = l;
        if (r < this.h.length && this.h[r].cost < this.h[s].cost) s = r;
        if (s === i) break;
        [this.h[s], this.h[i]] = [this.h[i], this.h[s]];
        i = s;
      }
    }
    return top;
  }
  get size() { return this.h.length; }
}

// ── Dijkstra ──────────────────────────────────────────────────────────────────
// Edge schema from graph-builder:
//   bus/rail: { type, from, to, route, trip, depart, arrive }
//   walk:     { type, from, to, duration, distance }
//   transfer: { type, from, to, duration }

function dijkstra(allEdges, originStops, destStopIds, departureTimeSec) {
  const adj = new Map();
  for (const edge of allEdges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from).push(edge);
  }

  const dist      = new Map();
  const prevRoute = new Map();
  const heap      = new MinHeap();
  const startTime = departureTimeSec;

  for (const stop of originStops) {
    const walkSec = Math.round(stop.distM / WALK_SPEED_MPS);
    const arrTime = startTime + walkSec;
    dist.set(stop.id, arrTime);
    heap.push({ cost: arrTime, stopId: stop.id, walkSec, transfers: 0 });
  }

  let best = null;

  while (heap.size > 0) {
    const { cost, stopId, walkSec, transfers } = heap.pop();

    if (cost > (dist.get(stopId) ?? Infinity) + 1) continue;
    if (cost - startTime > MAX_JOURNEY_SEC) break;

    if (destStopIds.has(stopId)) {
      if (!best || cost < best.arrivalTime) {
        best = { arrivalTime: cost, stopId, walkSec, transfers };
      }
      continue;
    }

    for (const edge of (adj.get(stopId) || [])) {
      let arrival     = cost;
      let newWalkSec  = walkSec;
      let newTransfers = transfers;

      if (edge.type === 'walk') {
        // walk edges: duration field (seconds)
        const dur = edge.duration ?? edge.durationSec ?? 120;
        newWalkSec += dur;
        if (newWalkSec > MAX_WALK_TOTAL_SEC) continue;
        arrival += dur;

      } else if (edge.type === 'bus' || edge.type === 'rail') {
        // each edge = one trip: depart/arrive in seconds since midnight
        if (edge.depart === undefined || edge.arrive === undefined) continue;
        if (edge.depart < cost) continue;           // trip already left
        if (edge.depart - cost > 7200) continue;    // wait > 2hrs, skip
        arrival = edge.arrive;
        // count transfer if switching routes
        const lastRoute = prevRoute.get(stopId);
        if (lastRoute && lastRoute !== edge.route) {
          newTransfers++;
          arrival += TRANSFER_PENALTY_SEC;
        }

      } else if (edge.type === 'transfer') {
        const dur = edge.duration ?? edge.durationSec ?? 180;
        arrival += dur + TRANSFER_PENALTY_SEC;
        newTransfers++;

      } else {
        continue; // unknown edge type
      }

      const existing = dist.get(edge.to);
      if (existing === undefined || arrival < existing) {
        dist.set(edge.to, arrival);
        prevRoute.set(edge.to, edge.route ?? null);
        heap.push({ cost: arrival, stopId: edge.to, walkSec: newWalkSec, transfers: newTransfers });
      }
    }
  }

  return best;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const cityId = process.argv[2];
if (!cityId || !CITIES[cityId]) {
  console.error(`Usage: node scripts/compute-pain-local.mjs <cityId>`);
  console.error(`Cities: ${Object.keys(CITIES).join(', ')}`);
  process.exit(1);
}

const city = CITIES[cityId];
console.log(`\nComputing pain factor for: ${city.name}`);

// 8:00–9:00 AM PDT window (15:00–16:00 UTC)
const WINDOW_START = 15 * 3600;
const WINDOW_END   = 16 * 3600;

console.log('Loading stop map from KV...');
const stopMap = kvGet(`stops:${cityId}`);
if (!stopMap) { console.error('No stop data — run build-graph-local.mjs first'); process.exit(1); }
console.log(`  ${Object.keys(stopMap).length} stops`);

console.log('Loading graph metadata...');
const meta = kvGet(`meta:${cityId}`);
if (!meta) { console.error('No graph metadata'); process.exit(1); }
console.log(`  ${meta.chunk_count} chunks`);

console.log(`Loading all ${meta.chunk_count} chunks from KV...`);
const allEdges = [];
for (let i = 0; i < meta.chunk_count; i++) {
  process.stdout.write(`  chunk ${i+1}/${meta.chunk_count}...`);
  const chunk = kvGet(`graph:${cityId}:chunk:${i}`);
  if (chunk) {
    const edges = Array.isArray(chunk) ? chunk : Object.values(chunk);
    for (const e of edges) allEdges.push(e);
    process.stdout.write(` ${edges.length} edges\n`);
  } else {
    process.stdout.write(` missing!\n`);
  }
}
console.log(`  Total: ${allEdges.length} edges\n`);

// Sanity check edge types
const types = {};
allEdges.forEach(e => { types[e.type] = (types[e.type] || 0) + 1; });
console.log('Edge types:', types);

console.log('\nFinding nearest stops...');
const originStops = findNearestStops(stopMap, city.origin.lat, city.origin.lon, 3);
const destStops   = findNearestStops(stopMap, city.destination.lat, city.destination.lon, 3);
console.log(`  Origin:      ${originStops.map(s => `${s.id}(${Math.round(s.distM)}m)`).join(', ')}`);
console.log(`  Destination: ${destStops.map(s => `${s.id}(${Math.round(s.distM)}m)`).join(', ')}`);

if (!originStops.length || !destStops.length) {
  console.error('No stops near origin or destination — check coordinates'); process.exit(1);
}

const destStopIds = new Set(destStops.map(s => s.id));

// Find first actual bus departure from origin stops in 8–9am window
const originStopIds = new Set(originStops.map(s => s.id));
let firstDeparture = WINDOW_END;
for (const edge of allEdges) {
  if ((edge.type === 'bus' || edge.type === 'rail') &&
      originStopIds.has(edge.from) &&
      edge.depart >= WINDOW_START && edge.depart < WINDOW_END) {
    if (edge.depart < firstDeparture) firstDeparture = edge.depart;
  }
}
const DEPARTURE_SEC = firstDeparture;
const departureStr = `${Math.floor(DEPARTURE_SEC/3600)}:${String(Math.floor((DEPARTURE_SEC%3600)/60)).padStart(2,'0')}`;
console.log(`\n  First departure from origin stops: ${departureStr} (${Math.round((DEPARTURE_SEC - WINDOW_START)/60)} min after 8am)`);

console.log('\nRunning Dijkstra...');
const result = dijkstra(allEdges, originStops, destStopIds, DEPARTURE_SEC);

if (!result) {
  console.error('No route found — no active service at 8am PDT or graph incomplete');
  process.exit(1);
}

const transitMin = Math.round((result.arrivalTime - DEPARTURE_SEC) / 60);
const distKm     = haversineKm(city.origin.lat, city.origin.lon, city.destination.lat, city.destination.lon);
const driveMin = 20; // weekday peak, Howe/Arden → Downtown via CA-160
const painFactor = Math.round((transitMin / driveMin) * 10) / 10;
const walkMin    = Math.round((result.walkSec || 0) / 60);
const waitMin    = Math.max(0, Math.round((transitMin - walkMin) * 0.4));
const waitPct    = Math.round((waitMin / transitMin) * 100);

console.log(`\n  Transit: ${transitMin} min`);
console.log(`  Drive:   ${driveMin} min`);
console.log(`  Pain:    ${painFactor}×`);
console.log(`  Walk:    ${walkMin} min`);
console.log(`  Wait:    ${waitMin} min (${waitPct}%)`);
console.log(`  Transfers: ${result.transfers}`);

console.log('\nFetching existing KV record...');
const existing = kvGet(`city:${cityId}`) || {};

const record = {
  ...existing,
  id:               cityId,
  name:             city.name,
  state:            city.state,
  rail_feed:        city.rail_feed,
  pain_factor:      painFactor,
  pain_score:       normalize(painFactor, BOUNDS.pain, 'lower_better'),
  transit_minutes:  transitMin,
  drive_minutes:    driveMin,
  walk_minutes:     walkMin,
  wait_minutes:     waitMin,
  wait_pct:         waitPct,
  transfers:        result.transfers,
  pain_computed_at: new Date().toISOString(),
};

// Recompute composite score if GTFS scores exist
if (existing.avg_headway_minutes != null && existing.stops_per_km2 != null) {
  record.score = (
    normalize(existing.avg_headway_minutes, BOUNDS.headway,  'lower_better')  * 0.40 +
    normalize(existing.stops_per_km2,       BOUNDS.coverage, 'higher_better') * 0.30 +
    normalize(painFactor,                   BOUNDS.pain,     'lower_better')  * 0.30
  ).toFixed(1);
  console.log(`\n  Composite score: ${record.score}`);
} else {
  console.log('\n  No GTFS scores in KV yet — run reseed-static-cities.mjs first');
}

console.log('\nWriting to KV...');
await kvPut(`city:${cityId}`, record);

console.log(`\n✅ ${city.name} — pain factor: ${painFactor}×  score: ${record.score ?? 'pending'}`);
console.log(`\nVerify:`);
console.log(`  curl "https://api-gateway.msgpnn.workers.dev/api/scores/${cityId}"`);
