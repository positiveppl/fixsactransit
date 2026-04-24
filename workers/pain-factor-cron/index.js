// workers/pain-factor-cron/index.js
// ── Runs every 6 hours ────────────────────────────────────────────────────────

import { CITIES, BOUNDS, normalize, computeScore } from '../../shared/cities.js';

// ── Routing constants ─────────────────────────────────────────────────────────

const TRANSFER_PENALTY_SEC = 300;
const MAX_WALK_TOTAL_SEC   = 2700;
const MAX_JOURNEY_SEC      = 10800;
const WALK_SPEED_MPS       = 1.33;
const DRIVE_SPEED_KMH      = 30;

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
    .filter(s => s.distM <= 3000)
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

function dijkstra(allEdges, originStops, destStopIds, departureTimeSec) {
  const adj = new Map();
  for (const edge of allEdges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from).push(edge);
  }
  const dist = new Map();
  const prevRoute = new Map();
  const heap = new MinHeap();
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
      if (!best || cost < best.arrivalTime) best = { arrivalTime: cost, walkSec, transfers };
      continue;
    }
    for (const edge of (adj.get(stopId) || [])) {
      let arrival = cost, newWalkSec = walkSec, newTransfers = transfers;
      if (edge.type === 'walk') {
        const dur = edge.duration ?? 120;
        newWalkSec += dur;
        if (newWalkSec > MAX_WALK_TOTAL_SEC) continue;
        arrival += dur;
      } else if (edge.type === 'bus' || edge.type === 'rail') {
        if (edge.depart === undefined || edge.arrive === undefined) continue;
        if (edge.depart < cost) continue;
        if (edge.depart - cost > 7200) continue;
        arrival = edge.arrive;
        const lastRoute = prevRoute.get(stopId);
        if (lastRoute && lastRoute !== edge.route) { newTransfers++; arrival += TRANSFER_PENALTY_SEC; }
      } else if (edge.type === 'transfer') {
        arrival += (edge.duration ?? 180) + TRANSFER_PENALTY_SEC;
        newTransfers++;
      } else continue;
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

// ── KV safe reader ────────────────────────────────────────────────────────────

async function kvGet(kv, key) {
  const raw = await kv.get(key);
  if (!raw || raw.startsWith('error code:')) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── Pain Factor Computation ───────────────────────────────────────────────────

async function computePainFactor(city, kv) {
  const [oLat, oLon] = city.trip.origin.split(',').map(Number);
  const [dLat, dLon] = city.trip.destination.split(',').map(Number);

  const stopMap = await kvGet(kv, `stops:${city.id}`);
  if (!stopMap) throw new Error(`No stop data for ${city.id}`);

  const meta = await kvGet(kv, `meta:${city.id}`);
  if (!meta) throw new Error(`No graph metadata for ${city.id}`);

  const allEdges = [];
  await Promise.all(
    Array.from({ length: meta.chunk_count }, (_, i) => i).map(async chunkId => {
      const chunk = await kvGet(kv, `graph:${city.id}:chunk:${chunkId}`);
      if (chunk) {
        const edges = Array.isArray(chunk) ? chunk : Object.values(chunk);
        allEdges.push(...edges);
      }
    })
  );

  const originStops = findNearestStops(stopMap, oLat, oLon, 3);
  const destStops   = findNearestStops(stopMap, dLat, dLon, 3);
  if (!originStops.length || !destStops.length) throw new Error(`No stops found near trip endpoints for ${city.id}`);

  const DEPARTURE_SEC = 8 * 3600; // 8am
  const result = dijkstra(allEdges, originStops, new Set(destStops.map(s => s.id)), DEPARTURE_SEC);
  if (!result) throw new Error(`No route found for ${city.id}`);

  const transitMin = Math.round((result.arrivalTime - DEPARTURE_SEC) / 60);
  const distKm     = haversineKm(oLat, oLon, dLat, dLon);
  const driveMin   = Math.max(5, Math.round((distKm / DRIVE_SPEED_KMH) * 60));
  const ratio      = Math.round((transitMin / driveMin) * 10) / 10;
  const walkMin    = Math.round((result.walkSec || 0) / 60);
  const waitMin    = Math.max(0, Math.round((transitMin - walkMin) * 0.4));
  const waitPct    = Math.round((waitMin / transitMin) * 100);

  return {
    transit_minutes:    transitMin,
    drive_minutes:      driveMin,
    walk_minutes:       walkMin,
    wait_minutes:       waitMin,
    wait_pct:           waitPct,
    transfers:          result.transfers,
    ratio,
    route_summary:      `${originStops[0]?.name} → ${destStops[0]?.name}`,
    next_departure_min: 0,
    legs:               [],
  };
}

// ── Worker ────────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  async scheduled(event, env, ctx) {
    console.log('pain-factor-cron: starting', new Date().toISOString());
    const results = [];

    for (const city of CITIES) {
      try {
        console.log(`Routing: ${city.name}`);
        const pain = await computePainFactor(city, env.TRANSIT_KV);
        const existing = await kvGet(env.TRANSIT_KV, `city:${city.id}`) || {};

        const record = {
          ...existing,
          id:               city.id,
          name:             city.name,
          state:            city.state,
          rail_feed:        city.rail_feed,
          pain_factor:      pain.ratio,
          transit_minutes:  pain.transit_minutes,
          drive_minutes:    pain.drive_minutes,
          walk_minutes:     pain.walk_minutes,
          wait_minutes:     pain.wait_minutes,
          wait_pct:         pain.wait_pct,
          transfers:        pain.transfers,
          route_summary:    pain.route_summary,
          legs:             pain.legs,
          pain_score:       normalize(pain.ratio, BOUNDS.pain, 'lower_better'),
          pain_computed_at: new Date().toISOString(),
        };

        if (existing.avg_headway_minutes != null && existing.coverage_pct != null) {
          record.score = computeScore(existing.avg_headway_minutes, existing.coverage_pct, pain.ratio);
        }

        await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
        results.push({ city: city.id, status: 'ok', pain_factor: pain.ratio });
        await sleep(300);

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: 'error', error: err.message });
      }
    }

    await env.TRANSIT_KV.put('pain:last_run', JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log('pain-factor-cron: done');
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/run') {
      await this.scheduled({}, env, {});
      return new Response(JSON.stringify({ status: 'done' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname.startsWith('/test/')) {
      const cityId = url.pathname.split('/')[2];
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return new Response('City not found', { status: 404 });
      try {
        const pain = await computePainFactor(city, env.TRANSIT_KV);
        return new Response(JSON.stringify(pain, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }, null, 2), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname === '/debug/sacramento') {
      const meta   = await kvGet(env.TRANSIT_KV, 'meta:sacramento');
      const stops  = await kvGet(env.TRANSIT_KV, 'stops:sacramento');
      const chunk0 = await kvGet(env.TRANSIT_KV, 'graph:sacramento:chunk:0');
      return new Response(JSON.stringify({
        meta,
        stop_count:        stops  ? Object.keys(stops).length  : 0,
        chunk0_edge_count: chunk0 ? Object.keys(chunk0).length : 0,
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('pain-factor-cron\n\nEndpoints:\n  /run\n  /test/:cityId\n  /debug/sacramento');
  },
};
