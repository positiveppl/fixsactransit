// workers/api-gateway/index.js
// ── Public API for fixsactransit.org ─────────────────────────────────────────
//
// Routes:
//   GET  /api/scores              → all city scores from KV
//   GET  /api/scores/:cityId      → single city score
//   GET  /api/live/:cityId        → proxy GTFS-RT vehicle positions (solves CORS)
//   GET  /api/status              → pipeline health check
//   POST /api/route               → trip planner routing

import { CITIES, BOUNDS, normalize, computeScore } from "../../shared/cities.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async scheduled(event, env, ctx) {
    await handleSeedPain(env);
  },

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

    // ── Route: POST /api/seed/pain ───────────────────────────────────────────
    if (path === "/api/seed/pain" && request.method === "POST") {
      return handleSeedPain(env);
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

    // ── Route: GET /api/departures ───────────────────────────────────────────
    if (path === "/api/departures") {
      return handleDepartures(url, env);
    }

    if (path === "/api/seed/pain" && request.method === "POST") {
      return handleSeedPain(env);
    }

    // ── Route: GET /api/status ───────────────────────────────────────────────
    if (path === "/api/status") {
      return handleStatus(env);
    }

    if (path === "/api/debug/sacramento") {
      const raw = await env.TRANSIT_KV.get("city:sacramento", { cacheTtl: 0 });
      return json({ raw_length: raw?.length, preview: raw?.slice(0, 200) });
    }

    if (path === "/api/debug/google") {
      const key = env.GOOGLE_MAPS_KEY;
      if (!key) return json({ error: 'GOOGLE_MAPS_KEY not found in env' });
      const now = new Date();
      const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() + daysUntilMonday);
      monday.setUTCHours(15, 0, 0, 0);
      const departureTime = monday.toISOString();
      const origin      = { location: { latLng: { latitude: 38.5961, longitude: -121.3882 } } };
      const destination = { location: { latLng: { latitude: 38.5762, longitude: -121.4934 } } };
      const headers     = { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key };
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: { ...headers, 'X-Goog-FieldMask': 'routes.duration,routes.legs.steps' },
        body: JSON.stringify({ origin, destination, travelMode: 'TRANSIT', departureTime }),
      });
      const data = await res.json();
      return json(data);
    }

    return json({ error: "Not found", available: ["/api/scores", "/api/live/:cityId", "/api/status", "/api/route"] }, 404);
  },
};

// ── Handlers ──────────────────────────────────────────────────────────────────

// POST /api/route
// Body: { originLat, originLon, destLat, destLon, cityId? }
// Returns: { transit_minutes, drive_minutes, pain_factor, walk_minutes, wait_minutes, transfers, origin_address, dest_address }
async function handleSeedPain(env) {
  const CITIES_TO_SEED = [
    // Sacramento: Howe & Arden (suburban arterial) → City Hall (~7km)
    { id: 'sacramento', originLat: 38.59611, originLon: -121.38819, destLat: 38.5762, destLon: -121.4934 },
    // San Francisco: Outer Sunset (19th Ave & Judah St) → City Hall (~8km)
    { id: 'san_francisco', originLat: 37.7614, originLon: -122.4786, destLat: 37.7793, destLon: -122.4193 },
    // Los Angeles: Reseda Blvd & Ventura Blvd, Van Nuys (suburban arterial) → City Hall (~18km)
    { id: 'los_angeles',   originLat: 34.1680, originLon: -118.5355, destLat: 34.0537, destLon: -118.2427 },
    // San Diego: El Cajon Blvd & 54th St, City Heights (suburban arterial) → City Hall (~7km)
    { id: 'san_diego',     originLat: 32.7524, originLon: -117.0982, destLat: 32.7157, destLon: -117.1564 },
    // San Jose: Stevens Creek Blvd & Winchester Blvd (suburban arterial) → City Hall (~8km)
    { id: 'san_jose',      originLat: 37.3230, originLon: -121.9530, destLat: 37.3382, destLon: -121.8863 },
  ];

  const results = [];
  for (const city of CITIES_TO_SEED) {
    try {
      const route = await googleRoute(city.originLat, city.originLon, city.destLat, city.destLon, env);
      if (!route) { results.push({ city: city.id, status: 'no_route' }); continue; }

      const existing = await env.TRANSIT_KV.get(`city:${city.id}`, 'json') || {};
      const painScore = normalize(route.painFactor, BOUNDS.pain, 'lower_better');
      const updated = {
        ...existing,
        pain_factor:      route.painFactor,
        transit_minutes:  route.transitMin,
        drive_minutes:    route.driveMin,
        walk_minutes:     route.walkMin,
        wait_minutes:     route.waitMin,
        wait_pct:         route.waitPct,
        transfers:        route.transfers,
        pain_score:       painScore,
        pain_computed_at: new Date().toISOString(),
      };
      // Recompute overall score if frequency + coverage data exists
      if (existing.avg_headway_minutes != null && existing.coverage_pct != null) {
        updated.score = computeScore(existing.avg_headway_minutes, existing.coverage_pct, route.painFactor);
      }
      await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(updated));
      results.push({ city: city.id, status: 'ok', pain_factor: route.painFactor, transit_minutes: route.transitMin, drive_minutes: route.driveMin });
    } catch (e) {
      results.push({ city: city.id, status: 'error', error: e.message });
    }
  }
  return json({ results });
}

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

  // Try Google first
  const route = await googleRoute(originLat, originLon, destLat, destLon, env);
  if (route) {
    return json({
      transit_minutes: route.transitMin,
      drive_minutes:   route.driveMin,
      pain_factor:     route.painFactor,
      walk_minutes:    route.walkMin,
      wait_minutes:    route.waitMin,
      wait_pct:        route.waitPct,
      transfers:       route.transfers,
      origin_stop:     route.originStop,
      dest_stop:       route.destStop,
      legs:            route.legs,
      source:          'google',
    });
  }

  // Fallback: Dijkstra
  const stopMap = await env.TRANSIT_KV.get(`stops:${cityId}`, "json");
  if (!stopMap) return json({ error: "No graph data for this city" }, 503);

  const originStops = findNearestStops(stopMap, originLat, originLon, 3);
  const destStops   = findNearestStops(stopMap, destLat, destLon, 3);

  if (!originStops.length || !destStops.length) {
    const outOfArea = !originStops.length && !destStops.length
      ? 'Neither location'
      : !originStops.length ? 'Your origin' : 'Your destination';
    return json({
      error: `${outOfArea} doesn't appear to be within SacRT's service area.`,
      hint: 'Try locations within Sacramento, Citrus Heights, Rancho Cordova, or North Highlands.'
    }, 404);
  }

  const meta = await env.TRANSIT_KV.get(`meta:${cityId}`, "json");
  if (!meta) return json({ error: "No graph metadata" }, 503);

  const chunkList = Array.from({ length: meta.chunk_count }, (_, i) => i);
  const allEdges = [];
  await Promise.all(
    chunkList.map(async chunkId => {
      const chunk = await env.TRANSIT_KV.get(`graph:${cityId}:chunk:${chunkId}`, "json");
      if (chunk) allEdges.push(...(Array.isArray(chunk) ? chunk : Object.values(chunk)));
    })
  );

  const DEPARTURE_SEC = 8 * 3600;
  const result = dijkstra(allEdges, originStops, new Set(destStops.map(s => s.id)), DEPARTURE_SEC);

  if (!result) {
    return json({
      error: "No route found. Try addresses closer to major bus corridors.",
      origin_stops: originStops.map(s => ({ id: s.id, name: s.name, distM: Math.round(s.distM) })),
      dest_stops:   destStops.map(s => ({ id: s.id, name: s.name, distM: Math.round(s.distM) })),
    }, 404);
  }

  const legs     = buildLegs(result, stopMap, originStops, destStops, DEPARTURE_SEC);
  const totalSec = result.arrivalTime - DEPARTURE_SEC;
  const walkSec  = legs.filter(l => l.type === 'walk').reduce((s, l) => s + l.durationSec, 0);
  const waitSec  = legs.filter(l => l.type === 'wait').reduce((s, l) => s + l.durationSec, 0);
  const transitMin = Math.round(totalSec / 60);
  const distKm     = haversineKm(originLat, originLon, destLat, destLon);
  const driveMin   = Math.max(5, Math.round((distKm / 40) * 60));
  const painFactor = Math.round((transitMin / driveMin) * 10) / 10;

  return json({
    transit_minutes: transitMin,
    drive_minutes:   driveMin,
    pain_factor:     painFactor,
    walk_minutes:    Math.round(walkSec / 60),
    wait_minutes:    Math.round(waitSec / 60),
    wait_pct:        totalSec > 0 ? Math.round((waitSec / totalSec) * 100) : 0,
    transfers:       result.transfers,
    origin_stop:     stopMap[result.originStopId]?.name ?? originStops[0]?.name,
    dest_stop:       stopMap[result.destStopId]?.name   ?? destStops[0]?.name,
    legs,
    source:          'dijkstra',
  });
}

// ── Google Routes API ─────────────────────────────────────────────────────────

async function googleRoute(originLat, originLon, destLat, destLon, env) {
  const key = env.GOOGLE_MAPS_KEY;
  if (!key) return null;

  // Next Monday at 8am Pacific (UTC-7) as ISO string
  const now = new Date();
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  monday.setUTCHours(15, 0, 0, 0); // 8am PDT = 15:00 UTC
  const departureTime = monday.toISOString();

  const origin      = { location: { latLng: { latitude: originLat, longitude: originLon } } };
  const destination = { location: { latLng: { latitude: destLat,   longitude: destLon   } } };
  const headers     = { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key };

  // Transit and driving in parallel
  const [transitRes, driveRes] = await Promise.all([
    fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: { ...headers, 'X-Goog-FieldMask': 'routes.duration,routes.legs.steps' },
      body: JSON.stringify({ origin, destination, travelMode: 'TRANSIT', departureTime }),
    }),
    fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: { ...headers, 'X-Goog-FieldMask': 'routes.duration' },
      body: JSON.stringify({ origin, destination, travelMode: 'DRIVE', departureTime, routingPreference: 'TRAFFIC_AWARE' }),
    }),
  ]);

  if (!transitRes.ok || !driveRes.ok) {
    console.error('Routes API HTTP error:', transitRes.status, driveRes.status);
    return null;
  }

  const [transitData, driveData] = await Promise.all([transitRes.json(), driveRes.json()]);

  if (!transitData.routes?.length || !driveData.routes?.length) {
    console.error('Routes API no routes:', JSON.stringify(transitData).slice(0, 400), JSON.stringify(driveData).slice(0, 200));
    return null;
  }

  const transitSec = parseInt(transitData.routes[0].duration);
  const driveSec   = parseInt(driveData.routes[0].duration);
  const transitMin = Math.round(transitSec / 60);
  const driveMin   = Math.round(driveSec / 60);
  const painFactor = Math.round((transitMin / driveMin) * 10) / 10;

  // Parse legs from Routes API step format
  // Walk steps are broken into sub-segments (turn-by-turn) — merge consecutive ones
  const legs = [];
  let walkSec    = 0;
  let waitSec    = 0;
  let transfers  = -1;
  let originStop = null;
  let destStop   = null;

  // Merge consecutive WALK steps into one, keep first instruction as label
  const mergedSteps = [];
  for (const step of transitData.routes[0]?.legs?.[0]?.steps ?? []) {
    if (step.travelMode === 'WALK') {
      const last = mergedSteps[mergedSteps.length - 1];
      if (last?.travelMode === 'WALK') {
        last.staticDuration = `${parseInt(last.staticDuration) + parseInt(step.staticDuration)}s`;
        last.distanceMeters = (last.distanceMeters || 0) + (step.distanceMeters || 0);
      } else {
        mergedSteps.push({ ...step });
      }
    } else {
      mergedSteps.push(step);
    }
  }

  for (const step of mergedSteps) {
    const dur = parseInt(step.staticDuration || '0s');

    if (step.travelMode === 'WALK') {
      walkSec += dur;
      const instruction = step.navigationInstruction?.instructions?.split('\n')[0] ?? '';
      legs.push({ type: 'walk', durationSec: dur, distanceM: step.distanceMeters, label: instruction || undefined });

    } else if (step.travelMode === 'TRANSIT') {
      const td      = step.transitDetails;
      const depStop = td?.stopDetails?.departureStop?.name;
      const arrStop = td?.stopDetails?.arrivalStop?.name;
      const depTime = td?.stopDetails?.departureTime ? new Date(td.stopDetails.departureTime).getTime() / 1000 : null;

      if (!originStop) originStop = depStop;
      destStop = arrStop;
      transfers++;

      // Wait = actual bus departure time minus our arrival at that stop
      if (depTime) {
        const elapsedSec = legs.reduce((s, l) => s + l.durationSec, 0);
        const arriveAtStop = monday.getTime() / 1000 + elapsedSec;
        const wait = Math.max(0, depTime - arriveAtStop);
        if (wait > 60) {
          waitSec += wait;
          legs.push({ type: 'wait', at: depStop, durationSec: Math.round(wait) });
        }
      }

      const vehicleType = td?.transitLine?.vehicle?.type ?? '';
      const isRail = ['HEAVY_RAIL', 'COMMUTER_TRAIN', 'SUBWAY', 'TRAM', 'LIGHT_RAIL'].includes(vehicleType);
      legs.push({
        type:        isRail ? 'rail' : 'bus',
        from:        depStop,
        to:          arrStop,
        durationSec: dur,
        route:       td?.transitLine?.nameShort || td?.transitLine?.name,
      });
    }
  }

  return {
    transitMin,
    driveMin,
    painFactor,
    walkMin:   Math.round(walkSec / 60),
    waitMin:   Math.round(waitSec / 60),
    waitPct:   transitSec > 0 ? Math.round((waitSec / transitSec) * 100) : 0,
    transfers: Math.max(0, transfers),
    originStop,
    destStop,
    legs,
  };
}



const TRANSFER_PENALTY_SEC = 300;
const WALK_LEG_PENALTY_SEC = 120;  // phantom cost per walk leg — discourages chaining stops instead of waiting for a bus
const MAX_WALK_TOTAL_SEC   = 2700;  // 45 min — covers 3km walk
const MAX_WALK_LEGS        = 4;     // max discrete walk segments (first mile + last mile + 2 transfers)
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
    .filter(s => s.distM <= 3000)
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

  // best[stopId] = { arrivalTime, cost, prev, prevEdge, walkSec, walkLegs, transfers, currentRoute }
  const best     = new Map();
  const heap     = new MinHeap();
  const startTime = departureTimeSec;

  for (const stop of originStops) {
    const walkSec = Math.round(stop.distM / WALK_SPEED_MPS);
    const arrTime = startTime + walkSec;
    const initCost = arrTime + WALK_LEG_PENALTY_SEC; // first-mile walk costs one penalty
    best.set(stop.id, { arrivalTime: arrTime, cost: initCost, prev: null, prevEdge: null, walkSec, walkLegs: 1, transfers: 0, currentRoute: null });
    heap.push({ cost: initCost, stopId: stop.id, walkSec, walkLegs: 1, transfers: 0 });
  }

  let bestDestId = null;

  while (heap.size > 0) {
    const { cost, stopId, walkSec, walkLegs, transfers } = heap.pop();
    const state = best.get(stopId);
    if (!state || cost > state.cost) continue;
    if (cost - startTime > MAX_JOURNEY_SEC) break;

    if (destStopIds.has(stopId)) {
      if (!bestDestId || state.arrivalTime < best.get(bestDestId).arrivalTime) bestDestId = stopId;
      continue;
    }

    for (const edge of (adj.get(stopId) || [])) {
      let arrivalTime  = state.arrivalTime;
      let newCost      = cost;
      let newWalkSec   = walkSec;
      let newWalkLegs  = walkLegs;
      let newTransfers = transfers;
      let newRoute     = state.currentRoute;

      if (edge.type === 'walk') {
        const dur = edge.duration ?? edge.durationSec ?? 120;
        newWalkSec += dur;
        if (newWalkSec > MAX_WALK_TOTAL_SEC) continue;
        newWalkLegs++;
        if (newWalkLegs > MAX_WALK_LEGS) continue; // hard cap on walk segments
        arrivalTime += dur;
        newCost     += dur + WALK_LEG_PENALTY_SEC; // real time + phantom penalty
      } else if (edge.type === 'bus' || edge.type === 'rail') {
        if (edge.depart === undefined || edge.arrive === undefined) continue;
        if (edge.depart < state.arrivalTime) continue;
        if (edge.depart - state.arrivalTime > 7200) continue;
        arrivalTime = edge.arrive;
        newCost     = cost + (edge.arrive - state.arrivalTime); // actual elapsed time
        if (state.currentRoute && state.currentRoute !== edge.route) {
          newTransfers++;
          arrivalTime += TRANSFER_PENALTY_SEC;
          newCost     += TRANSFER_PENALTY_SEC;
        }
        newRoute = edge.route ?? null;
      } else if (edge.type === 'transfer') {
        const dur = edge.duration ?? edge.durationSec ?? 180;
        arrivalTime += dur + TRANSFER_PENALTY_SEC;
        newCost     += dur + TRANSFER_PENALTY_SEC;
        newTransfers++;
      } else {
        continue;
      }

      const existing = best.get(edge.to);
      if (!existing || newCost < existing.cost) {
        best.set(edge.to, { arrivalTime, cost: newCost, prev: stopId, prevEdge: edge, walkSec: newWalkSec, walkLegs: newWalkLegs, transfers: newTransfers, currentRoute: newRoute });
        heap.push({ cost: newCost, stopId: edge.to, walkSec: newWalkSec, walkLegs: newWalkLegs, transfers: newTransfers });
      }
    }
  }

  if (!bestDestId) return null;
  const destState = best.get(bestDestId);

  // Walk back to find which origin stop was used
  let cur = bestDestId;
  const visited = new Set();
  while (best.get(cur)?.prev !== null) {
    if (visited.has(cur)) break;
    visited.add(cur);
    const next = best.get(cur).prev;
    if (next === cur) break;
    cur = next;
  }
  const originStopId = cur;

  return { arrivalTime: destState.arrivalTime, walkSec: destState.walkSec, transfers: destState.transfers, originStopId, destStopId: bestDestId, best };
}

function buildLegs(result, stopMap, originStops, destStops, startTimeSec) {
  const legs = [];
  const { best, originStopId, destStopId } = result;

  // Reconstruct path from dest back to origin
  const pathEdges = [];
  const visited = new Set();
  let cur = destStopId;
  while (best.get(cur)?.prev !== null) {
    if (visited.has(cur)) break; // cycle guard
    visited.add(cur);
    const state = best.get(cur);
    pathEdges.unshift({ from: state.prev, edge: state.prevEdge });
    cur = state.prev;
  }

  // First-mile walk
  const originStop = originStops.find(s => s.id === originStopId) ?? originStops[0];
  const firstWalkSec = Math.round((originStop?.distM ?? 200) / WALK_SPEED_MPS);
  let currentTime = startTimeSec;

  if (firstWalkSec > 30) {
    legs.push({ type: 'walk', to: stopMap[originStopId]?.name ?? originStopId, durationSec: firstWalkSec, distanceM: Math.round(originStop?.distM ?? 200) });
    currentTime += firstWalkSec;
  }

  // Transit legs
  let currentRoute = null;
  let currentLegFrom = stopMap[originStopId]?.name ?? originStopId;
  let currentLegDepart = 0;

  for (const { from, edge } of pathEdges) {
    if (edge.type === 'walk' || edge.type === 'transfer') {
      if (currentRoute) {
        legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[from]?.name ?? from, durationSec: currentTime - currentLegDepart });
        currentRoute = null;
      }
      const waitSec = Math.max(0, (edge.depart ?? currentTime) - currentTime);
      if (waitSec > 60) {
        legs.push({ type: 'wait', at: stopMap[from]?.name ?? from, durationSec: waitSec });
        currentTime += waitSec;
      }
      const dur = edge.duration ?? edge.durationSec ?? 120;
      legs.push({ type: 'walk', from: stopMap[from]?.name ?? from, to: stopMap[edge.to]?.name ?? edge.to, durationSec: dur });
      currentTime += dur;
    } else {
      // bus/rail
      if (!currentRoute) {
        const waitSec = Math.max(0, (edge.depart ?? currentTime) - currentTime);
        if (waitSec > 60) {
          legs.push({ type: 'wait', at: stopMap[from]?.name ?? from, durationSec: waitSec });
        }
        currentRoute     = edge.route ?? 'bus';
        currentLegFrom   = stopMap[from]?.name ?? from;
        currentLegDepart = edge.depart ?? currentTime;
        currentTime      = edge.arrive;
      } else if (edge.route && edge.route !== currentRoute) {
        legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[from]?.name ?? from, durationSec: currentTime - currentLegDepart });
        currentRoute     = edge.route;
        currentLegFrom   = stopMap[from]?.name ?? from;
        currentLegDepart = edge.depart ?? currentTime;
        currentTime      = edge.arrive;
      } else {
        currentTime = edge.arrive;
      }
    }
  }

  // Flush final transit leg
  if (currentRoute && pathEdges.length) {
    const lastEdge = pathEdges[pathEdges.length - 1].edge;
    legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[lastEdge.to]?.name ?? lastEdge.to, durationSec: currentTime - currentLegDepart });
  }

  // Last-mile walk
  const destStop = destStops.find(s => s.id === destStopId) ?? destStops[0];
  const lastWalkSec = Math.round((destStop?.distM ?? 200) / WALK_SPEED_MPS);
  if (lastWalkSec > 30) {
    legs.push({ type: 'walk', from: stopMap[destStopId]?.name ?? destStopId, to: 'Destination', durationSec: lastWalkSec, distanceM: Math.round(destStop?.distM ?? 200) });
  }

  return legs;
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
      wait_minutes: kv.wait_minutes ?? null,
      wait_pct: kv.wait_pct ?? null,
      transfers: kv.transfers ?? null,
      walk_minutes: kv.walk_minutes ?? null,
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

async function handleDepartures(url, env) {
  const lat = parseFloat(url.searchParams.get("lat"));
  const lon = parseFloat(url.searchParams.get("lon"));
  const cityId = url.searchParams.get("city") || "sacramento";

  if (isNaN(lat) || isNaN(lon)) {
    return json({ error: "Required: lat, lon" }, 400);
  }

  // Find nearest stops
  const stopMap = await env.TRANSIT_KV.get(`stops:${cityId}`, "json");
  if (!stopMap) return json({ error: "No stop data" }, 503);

  const nearbyStops = Object.entries(stopMap)
    .map(([id, s]) => ({ id, ...s, distM: haversineKm(lat, lon, s.lat, s.lon) * 1000 }))
    .filter(s => s.distM <= 600)
    .sort((a, b) => a.distM - b.distM)
    .slice(0, 5);

  if (!nearbyStops.empty && nearbyStops.length === 0) {
    return json({ error: "No stops found within 600m", departures: [] });
  }

  const nearbyStopIds = new Set(nearbyStops.map(s => s.id));

  // Current time in seconds since midnight (Pacific time)
  const now = new Date();
  const pacificOffset = -7; // PDT (use -8 for PST)
  const pacificNow = new Date(now.getTime() + pacificOffset * 3600 * 1000);
  const nowSec = pacificNow.getUTCHours() * 3600 + pacificNow.getUTCMinutes() * 60 + pacificNow.getUTCSeconds();

  // Load all route trip keys in parallel
  const routeKeys = await env.TRANSIT_KV.list({ prefix: `trips:${cityId}:` });
  const tripArrays = await Promise.all(
    routeKeys.keys.map(async ({ name }) => {
      const data = await env.TRANSIT_KV.get(name, "json");
      const routeId = name.split(":")[2];
      return { routeId, stops: data || [] };
    })
  );

// Find upcoming departures from nearby stops
  const departures = [];

  for (const { routeId, stops: tripList } of tripArrays) {
    for (const trip of tripList) {
      const stopTimes = trip.stops || [];
      for (const st of stopTimes) {
        if (!nearbyStopIds.has(st.stop_id)) continue;
        if (st.pickup_type === "1") continue;

        const depSec = timeStrToSec(st.departure_time);
        const minUntil = Math.round((depSec - nowSec) / 60);

        if (minUntil < 0 || minUntil > 90) continue;

        const lastStop = stopTimes[stopTimes.length - 1];
        const stopInfo = stopMap[st.stop_id];
        const nearStop = nearbyStops.find(s => s.id === st.stop_id);

        departures.push({
          route: routeId,
          stop_name: stopInfo?.name || st.stop_id,
          dist_m: Math.round(nearStop?.distM || 0),
          headsign: lastStop ? (stopMap[lastStop.stop_id]?.name || lastStop.stop_id) : "—",
          departure_time: st.departure_time,
          minutes: minUntil,
        });
      }
    }
  }


  // Deduplicate same route + time + stop combinations
  const seen = new Set();
  const unique = departures.filter(d => {
    const key = `${d.route}:${d.departure_time}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => a.minutes - b.minutes);

  return json({
    location: { lat, lon },
    nearby_stops: nearbyStops.map(s => ({ id: s.id, name: s.name, dist_m: Math.round(s.distM) })),
    departures: unique.slice(0, 12),
    generated_at: new Date().toISOString(),
    note: "Schedule-based · No live feed available for SacRT buses",
  });
}

function timeStrToSec(t) {
  if (!t) return NaN;
  const [h, m, s] = t.split(":").map(Number);
  return h * 3600 + m * 60 + (s || 0);
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
