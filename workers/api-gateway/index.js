// workers/api-gateway/index.js
// ── Public API for fixsactransit.org ─────────────────────────────────────────
//
// Routes:
//   GET  /api/scores              → all city scores from KV
//   GET  /api/scores/:cityId      → single city score
//   GET  /api/live/:cityId        → proxy GTFS-RT vehicle positions (solves CORS)
//   GET  /api/status              → pipeline health check
//   POST /api/route               → trip planner routing

import { CITIES } from "../../shared/cities.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── Route: POST /api/route ───────────────────────────────────────────────
    if (path === "/api/route" && request.method === "POST") {
      return handleRoute(request, env);
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405);
    }

    // ── Route: GET /api/scores ──────────────────────────────────────────────
    if (path === "/api/scores") {
      return handleAllScores(env);
    }

    // ── Route: GET /api/scores/:cityId ──────────────────────────────────────
    const scoreMatch = path.match(/^\/api\/scores\/([a-z_]+)$/);
    if (scoreMatch) {
      return handleCityScore(scoreMatch[1], env);
    }

    // ── Route: GET /api/live/:cityId ─────────────────────────────────────────
    const liveMatch = path.match(/^\/api\/live\/([a-z_]+)$/);
    if (liveMatch) {
      return handleLiveFeed(liveMatch[1], env);
    }

    // ── Route: GET /api/status ───────────────────────────────────────────────
    if (path === "/api/status") {
      return handleStatus(env);
    }

    if (path === "/api/debug/sacramento") {
      const raw = await env.TRANSIT_KV.get("city:sacramento", { cacheTtl: 0 });
      return json({ raw_length: raw?.length, preview: raw?.slice(0, 200) });
    }

    return json({ error: "Not found", available: ["/api/scores", "/api/live/:cityId", "/api/status", "/api/route"] }, 404);
  },
};

// ── Handlers ──────────────────────────────────────────────────────────────────

// POST /api/route
// Body: { originLat, originLon, destLat, destLon, cityId? }
// Returns: { transit_minutes, drive_minutes, pain_factor, walk_minutes, wait_minutes, transfers, origin_address, dest_address }
async function handleRoute(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { originLat, originLon, destLat, destLon, cityId = "sacramento" } = body;

  if (!originLat || !originLon || !destLat || !destLon) {
    return json({ error: "Required: originLat, originLon, destLat, destLon" }, 400);
  }

  const city = CITIES.find(c => c.id === cityId);
  if (!city) return json({ error: `Unknown city: ${cityId}` }, 404);

  // Load stop map
  const stopMap = await env.TRANSIT_KV.get(`stops:${cityId}`, "json");
  if (!stopMap) return json({ error: "No graph data for this city" }, 503);

  // Find nearest stops to origin and destination
  const originStops = findNearestStops(stopMap, originLat, originLon, 3);
  const destStops   = findNearestStops(stopMap, destLat, destLon, 3);

  if (!originStops.length || !destStops.length) {
    return json({ error: "No stops found near origin or destination — try a location closer to a bus stop" }, 404);
  }

  // Load only the chunks containing relevant stops
  const neededChunks = new Set();
  [...originStops, ...destStops].forEach(s => {
    if (s.chunk !== undefined) neededChunks.add(s.chunk);
  });

  // Load adjacent chunks too for routing through transfer points
  const meta = await env.TRANSIT_KV.get(`meta:${cityId}`, "json");
  if (!meta) return json({ error: "No graph metadata" }, 503);

  // Expand to neighboring chunks to ensure connectivity
  const chunksToLoad = new Set(neededChunks);
  for (const c of neededChunks) {
    if (c > 0) chunksToLoad.add(c - 1);
    if (c < meta.chunk_count - 1) chunksToLoad.add(c + 1);
  }

  // Cap at 4 chunks max to stay under CPU limit
  const chunkList = Array.from(chunksToLoad).slice(0, 4);

  const allEdges = [];
  await Promise.all(
    chunkList.map(async chunkId => {
      const chunk = await env.TRANSIT_KV.get(`graph:${cityId}:chunk:${chunkId}`, "json");
      if (chunk) {
        const edges = Array.isArray(chunk) ? chunk : Object.values(chunk);
        allEdges.push(...edges);
      }
    })
  );

  // 8am PDT departure
  const DEPARTURE_SEC = 15 * 3600;

  const result = dijkstra(allEdges, originStops, new Set(destStops.map(s => s.id)), DEPARTURE_SEC);

  if (!result) {
    return json({
      error: "No route found — limited graph loaded for performance. Try addresses closer to major bus corridors.",
      origin_stops: originStops.map(s => ({ id: s.id, name: s.name, distM: Math.round(s.distM) })),
      dest_stops: destStops.map(s => ({ id: s.id, name: s.name, distM: Math.round(s.distM) })),
      chunks_loaded: chunkList.length,
    }, 404);
  }

  const transitMin = Math.round((result.arrivalTime - DEPARTURE_SEC) / 60);
  const distKm     = haversineKm(originLat, originLon, destLat, destLon);
  const driveMin   = Math.max(5, Math.round((distKm / 30) * 60));
  const painFactor = Math.round((transitMin / driveMin) * 10) / 10;
  const walkMin    = Math.round((result.walkSec || 0) / 60);
  const waitMin    = Math.max(0, Math.round((transitMin - walkMin) * 0.4));
  const waitPct    = Math.round((waitMin / transitMin) * 100);

  return json({
    transit_minutes: transitMin,
    drive_minutes:   driveMin,
    pain_factor:     painFactor,
    walk_minutes:    walkMin,
    wait_minutes:    waitMin,
    wait_pct:        waitPct,
    transfers:       result.transfers,
    chunks_loaded:   chunkList.length,
    origin_stop:     originStops[0]?.name,
    dest_stop:       destStops[0]?.name,
  });
}

// ── Routing ───────────────────────────────────────────────────────────────────

const TRANSFER_PENALTY_SEC = 300;
const MAX_WALK_TOTAL_SEC   = 1200;
const MAX_JOURNEY_SEC      = 10800;
const WALK_SPEED_MPS       = 1.33;

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
      let arrival      = cost;
      let newWalkSec   = walkSec;
      let newTransfers = transfers;

      if (edge.type === 'walk') {
        const dur = edge.duration ?? edge.durationSec ?? 120;
        newWalkSec += dur;
        if (newWalkSec > MAX_WALK_TOTAL_SEC) continue;
        arrival += dur;
      } else if (edge.type === 'bus' || edge.type === 'rail') {
        if (edge.depart === undefined || edge.arrive === undefined) continue;
        if (edge.depart < cost) continue;
        if (edge.depart - cost > 7200) continue;
        arrival = edge.arrive;
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
        continue;
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

// ── Score handlers (unchanged) ────────────────────────────────────────────────

async function handleAllScores(env) {
  const cityIds = CITIES.map(c => c.id);
  const records = await Promise.all(
    cityIds.map(id => env.TRANSIT_KV.get(`city:${id}`, "json"))
  );

  const cities = CITIES.map((city, i) => {
    const kv = records[i] || {};
    return {
      id: city.id,
      name: city.name,
      state: city.state,
      rail_feed: city.rail_feed,
      score: kv.score ?? null,
      frequency_score: kv.frequency_score ?? null,
      coverage_score: kv.coverage_score ?? null,
      pain_score: kv.pain_score ?? null,
      pain_factor: kv.pain_factor ?? null,
      transit_minutes: kv.transit_minutes ?? null,
      drive_minutes: kv.drive_minutes ?? null,
      avg_headway_minutes: kv.avg_headway_minutes ?? null,
      coverage_pct: kv.coverage_pct ?? null,
      stop_count: kv.stop_count ?? null,
      gtfs_computed_at: kv.gtfs_computed_at ?? null,
      pain_computed_at: kv.pain_computed_at ?? null,
    };
  });

  const sorted = [...cities].sort((a, b) => {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });

  return json({
    cities: sorted,
    methodology: {
      weights: { frequency: 0.40, coverage: 0.30, pain: 0.30 },
      coverage_method: "stops per sq km of urban area",
      frequency_method: "avg peak headway (7-9am, 4-7pm weekdays)",
      pain_method: "Dijkstra routing through GTFS graph vs straight-line drive estimate",
      source: "GTFS static feeds + local routing",
      updated: "Weekly (GTFS) + on-demand (pain factor)",
    },
  });
}

async function handleCityScore(cityId, env) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return json({ error: `Unknown city: ${cityId}` }, 404);
  const kv = await env.TRANSIT_KV.get(`city:${cityId}`, "json");
  if (!kv) return json({ error: "No data yet — cron hasn't run", city: cityId }, 202);
  return json(kv);
}

async function handleLiveFeed(cityId, env) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return json({ error: `Unknown city: ${cityId}` }, 404);
  if (!city.gtfs_rt) return json({ error: "No GTFS-RT feed configured for this city" }, 404);

  try {
    let feedUrl = city.gtfs_rt;
    if (city.rt_key_env) {
      const key = env[city.rt_key_env];
      if (!key) return json({ error: `API key not configured: ${city.rt_key_env}` }, 503);
      feedUrl = feedUrl.replace(`{${city.rt_key_env}}`, key);
    }

    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "fixsactransit.org/1.0" },
      cf: { cacheTtl: 15 },
    });

    if (!res.ok) return json({ error: `Upstream feed error: ${res.status}` }, 502);

    const body = await res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=15",
        "X-City": cityId,
      },
    });
  } catch (err) {
    return json({ error: "Failed to fetch live feed", detail: err.message }, 502);
  }
}

async function handleStatus(env) {
  const [lastGtfs, lastPain] = await Promise.all([
    env.TRANSIT_KV.get("index:last_run", "json"),
    env.TRANSIT_KV.get("pain:last_run", "json"),
  ]);
  const cityIds = CITIES.map(c => c.id);
  const records = await Promise.all(cityIds.map(id => env.TRANSIT_KV.get(`city:${id}`, "json")));
  const withScores = records.filter(r => r?.score).length;

  return json({
    status: withScores > 0 ? "ok" : "no_data",
    cities_with_scores: withScores,
    total_cities: CITIES.length,
    last_gtfs_run: lastGtfs?.ran_at ?? null,
    last_pain_run: lastPain?.ran_at ?? null,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
