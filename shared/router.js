// shared/router.js
// ── Time-dependent Dijkstra transit router ────────────────────────────────────
//
// Reads chunked graph from KV, finds optimal transit route between two stops,
// returns full itinerary with legs, wait times, and transfers.
//
// Key design decisions:
//   - Chunk-aware: only loads KV chunks containing relevant stops
//   - Time-dependent: uses next available departure after current time
//   - Transfer penalty: discourages unnecessary transfers
//   - Walking budget: caps total walk time

const TRANSFER_PENALTY_SEC = 300;  // 5 min penalty per transfer (discourages unnecessary transfers)
const MAX_WALK_TOTAL_SEC   = 1200; // 20 min total walking budget
const MAX_JOURNEY_SEC = 10800; // 3 hour hard cap
const WALK_SPEED_MPS       = 1.33;

// ── Main Router Entry Point ───────────────────────────────────────────────────

export async function findRoute(kv, cityId, fromLatLon, toLatLon, departureTimeSec) {
  // 1. Load stops index
  const stopMap = await kv.get(`stops:${cityId}`, 'json');
  if (!stopMap) throw new Error(`No stop data for ${cityId} — run graph builder first`);

  // 2. Find nearest stops to origin and destination
  const originStops = findNearestStops(stopMap, fromLatLon.lat, fromLatLon.lon, 3);
  const destStops   = findNearestStops(stopMap, toLatLon.lat,  toLatLon.lon,   3);

  if (!originStops.length || !destStops.length) {
    throw new Error(`No stops found near origin or destination in ${cityId}`);
  }

  const destStopIds = new Set(destStops.map(s => s.id));

// Only load chunks containing relevant stops
  const relevantStopIds = [
    ...originStops.map(s => s.id),
    ...destStops.map(s => s.id),
  ];

  // 3. Load meta to know chunk count
  const meta = await kv.get(`meta:${cityId}`, 'json');
  if (!meta) throw new Error(`No graph metadata for ${cityId}`);

  // 4. Load all chunks (for smaller cities like Sacramento, this is fast)
  // For large cities: lazy-load chunks as we expand nodes
  const allEdges = await loadAllChunks(kv, cityId, meta.chunk_count, relevantStopIds, stopMap);

  // 5. Run time-dependent Dijkstra from all origin stops simultaneously
  const result = dijkstra(allEdges, originStops, destStopIds, departureTimeSec, stopMap);

  if (!result) return null;

  // 6. Add first/last mile walking legs
  return buildFullItinerary(result, fromLatLon, toLatLon, originStops, destStops, stopMap);
}

// ── Nearest Stop Finder ───────────────────────────────────────────────────────

function findNearestStops(stopMap, lat, lon, count = 3) {
  return Object.entries(stopMap)
    .map(([id, stop]) => ({
      id,
      ...stop,
      distM: haversineMeters(lat, lon, stop.lat, stop.lon),
    }))
    .filter(s => s.distM <= 1500) // within 1.5km
    .sort((a, b) => a.distM - b.distM)
    .slice(0, count);
}

// ── Chunk Loader ──────────────────────────────────────────────────────────────

async function loadAllChunks(kv, cityId, chunkCount, relevantStopIds, stopMap) {
  const allEdges = [];

  for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
    const chunk = await kv.get(`graph:${cityId}:chunk:${chunkId}`, 'json');
    if (!chunk) continue;

    // Handle both array and object formats
    const edges = Array.isArray(chunk) ? chunk : Object.values(chunk);
    allEdges.push(...edges);
  }

  console.log(`Loaded ${allEdges.length} edges from ${chunkCount} chunks`);
  return allEdges;
}

// ── Time-Dependent Dijkstra ───────────────────────────────────────────────────

function dijkstra(edges, originStops, destStopIds, startTimeSec, stopMap) {
  // State: { stopId → { arrivalTime, prev, prevEdge, transferCount, walkTime } }
  const best  = {};
  const queue = new MinHeap();

  // Initialize with all origin stops (accounting for walk from actual origin)
  originStops.forEach(stop => {
    const walkSec = Math.round(stop.distM / WALK_SPEED_MPS);
    const arriveAt = startTimeSec + walkSec;

    best[stop.id] = {
      arrivalTime:   arriveAt,
      prev:          null,
      prevEdge:      null,
      transferCount: 0,
      walkTime:      walkSec,
      currentTrip:   null,
    };

    queue.push({ stopId: stop.id, time: arriveAt, cost: arriveAt }, arriveAt);
  });

  // Track best arrival at any destination stop
  let bestDest = null;

  while (!queue.isEmpty()) {
    const { stopId, time } = queue.pop();
    const state = best[stopId];

    // Skip if we've found a better path to this stop already
    if (state.arrivalTime < time) continue;

    // Check if this is a destination
    if (destStopIds.has(stopId)) {
      if (!bestDest || time < best[bestDest].arrivalTime) {
        bestDest = stopId;
      }
      continue; // keep searching for potentially better routes to other dest stops
    }

    // Hard cap
    if (time - startTimeSec > MAX_JOURNEY_SEC) continue;

    // Expand outgoing edges from this stop
    const outgoing = edges.filter(e => e.from === stopId);

    for (const edge of outgoing) {
      let arriveTime, waitTime, newWalkTime, newTransfers;

      if (edge.type === 'walk' || edge.type === 'transfer') {
        // Walking / transfer — always available, just takes time
        arriveTime   = time + edge.duration;
        waitTime     = 0;
        newWalkTime  = state.walkTime + (edge.type === 'walk' ? edge.duration : 0);
        newTransfers = state.transferCount + (edge.type === 'transfer' ? 1 : 0);

        // Reject if over walking budget
        if (newWalkTime > MAX_WALK_TOTAL_SEC) continue;

      } else {
        // Transit edge (bus/rail) — must wait for next departure
        if (edge.depart < time) continue; // already departed

        waitTime     = edge.depart - time;
        arriveTime   = edge.arrive;
        newWalkTime  = state.walkTime;

        // Count transfer if switching trips
        const switchingTrip = state.currentTrip && state.currentTrip !== edge.trip;
        newTransfers = state.transferCount + (switchingTrip ? 1 : 0);
      }

      // Cost = arrival time + transfer penalty
      const cost = arriveTime + newTransfers * TRANSFER_PENALTY_SEC;

      // Check if this is an improvement
      const existing = best[edge.to];
      if (existing && existing.arrivalTime <= arriveTime) continue;

      best[edge.to] = {
        arrivalTime:   arriveTime,
        prev:          stopId,
        prevEdge:      edge,
        transferCount: newTransfers,
        walkTime:      newWalkTime,
        currentTrip:   edge.trip || state.currentTrip,
        waitTime:      (existing?.waitTime || 0) + waitTime,
      };

      queue.push({ stopId: edge.to, time: arriveTime, cost }, cost);
    }
  }

  if (!bestDest) return null;

  // Reconstruct path
  return reconstructPath(best, bestDest, startTimeSec);
}

// ── Path Reconstruction ───────────────────────────────────────────────────────

function reconstructPath(best, destStopId, startTimeSec) {
  const legs = [];
  let current = destStopId;

  while (best[current]?.prev) {
    const state = best[current];
    legs.unshift({
      from:    state.prev,
      to:      current,
      edge:    state.prevEdge,
      arriveAt: state.arrivalTime,
    });
    current = state.prev;
  }

  const finalState = best[destStopId];

  return {
    legs,
    originStopId:    current,
    destStopId,
    departureTime:   startTimeSec,
    arrivalTime:     finalState.arrivalTime,
    totalSeconds:    finalState.arrivalTime - startTimeSec,
    transferCount:   finalState.transferCount,
    totalWalkTime:   finalState.walkTime,
    totalWaitTime:   finalState.waitTime || 0,
  };
}

// ── Itinerary Builder ─────────────────────────────────────────────────────────

function buildFullItinerary(routeResult, fromLatLon, toLatLon, originStops, destStops, stopMap) {
  const legs = [];
  let currentTime = routeResult.departureTime;

  // First mile walk
  const firstStop   = stopMap[routeResult.originStopId];
  const originStop  = originStops.find(s => s.id === routeResult.originStopId) || originStops[0];
  const firstWalkSec = Math.round(originStop.distM / WALK_SPEED_MPS);

  if (firstWalkSec > 30) {
    legs.push({
      type:        'walk',
      from:        'Origin',
      to:          firstStop?.name || routeResult.originStopId,
      durationSec: firstWalkSec,
      distanceM:   Math.round(originStop.distM),
      startTime:   currentTime,
      endTime:     currentTime + firstWalkSec,
    });
    currentTime += firstWalkSec;
  }

  // Transit legs — merge consecutive segments of the same trip into one leg
  let currentTripId  = null;
  let currentLegFrom = null;
  let currentLegDeparture = null;

  for (const leg of routeResult.legs) {
    const edge = leg.edge;
    if (!edge) continue;

    if (edge.type === 'walk' || edge.type === 'transfer') {
      // Flush current transit leg
      if (currentTripId) {
        legs.push(buildTransitLeg(currentLegFrom, leg.from, currentTripId,
          currentLegDeparture, currentTime, edge, stopMap));
        currentTripId = null;
      }

      // Wait leg if there's a gap
      const waitSec = Math.max(0, (edge.depart || currentTime) - currentTime);
      if (waitSec > 60) {
        legs.push({
          type:        'wait',
          at:          stopMap[leg.from]?.name || leg.from,
          durationSec: waitSec,
          startTime:   currentTime,
          endTime:     currentTime + waitSec,
        });
        currentTime += waitSec;
      }

      // Walk/transfer leg
      legs.push({
        type:        edge.type,
        from:        stopMap[edge.from]?.name || edge.from,
        to:          stopMap[edge.to]?.name   || edge.to,
        durationSec: edge.duration,
        distanceM:   edge.distance,
        startTime:   currentTime,
        endTime:     currentTime + edge.duration,
      });
      currentTime += edge.duration;

    } else {
      // Transit (bus/rail)
      if (currentTripId && currentTripId !== edge.trip) {
        // Trip change — flush and add wait
        legs.push(buildTransitLeg(currentLegFrom, leg.from, currentTripId,
          currentLegDeparture, currentTime, edge, stopMap));

        const waitSec = Math.max(0, edge.depart - currentTime);
        if (waitSec > 60) {
          legs.push({
            type:        'wait',
            at:          stopMap[leg.from]?.name || leg.from,
            durationSec: waitSec,
            startTime:   currentTime,
            endTime:     currentTime + waitSec,
          });
        }
        currentTime = edge.depart;
        currentTripId       = edge.trip;
        currentLegFrom      = edge.from;
        currentLegDeparture = edge.depart;

      } else if (!currentTripId) {
        // Wait for first bus
        const waitSec = Math.max(0, edge.depart - currentTime);
        if (waitSec > 60) {
          legs.push({
            type:        'wait',
            at:          stopMap[edge.from]?.name || edge.from,
            durationSec: waitSec,
            startTime:   currentTime,
            endTime:     currentTime + waitSec,
          });
        }
        currentTime         = edge.depart;
        currentTripId       = edge.trip;
        currentLegFrom      = edge.from;
        currentLegDeparture = edge.depart;
      }

      currentTime = edge.arrive;
    }
  }

  // Flush final transit leg
  if (currentTripId && routeResult.legs.length) {
    const lastLeg = routeResult.legs[routeResult.legs.length - 1];
    legs.push(buildTransitLeg(currentLegFrom, lastLeg.to, currentTripId,
      currentLegDeparture, currentTime, null, stopMap));
  }

  // Last mile walk
  const lastStop   = stopMap[routeResult.destStopId];
  const destStop   = destStops.find(s => s.id === routeResult.destStopId) || destStops[0];
  const lastWalkSec = Math.round((destStop?.distM || 200) / WALK_SPEED_MPS);

  if (lastWalkSec > 30) {
    legs.push({
      type:        'walk',
      from:        lastStop?.name || routeResult.destStopId,
      to:          'Destination',
      durationSec: lastWalkSec,
      distanceM:   Math.round(destStop?.distM || 200),
      startTime:   currentTime,
      endTime:     currentTime + lastWalkSec,
    });
    currentTime += lastWalkSec;
  }

  const totalSec    = currentTime - routeResult.departureTime;
  const waitSec     = legs.filter(l => l.type === 'wait').reduce((s, l) => s + l.durationSec, 0);
  const walkSec     = legs.filter(l => l.type === 'walk').reduce((s, l) => s + l.durationSec, 0);
  const transitSec  = legs.filter(l => l.type === 'bus' || l.type === 'rail').reduce((s, l) => s + l.durationSec, 0);

  return {
    total_minutes:    Math.round(totalSec / 60),
    wait_minutes:     Math.round(waitSec / 60),
    walk_minutes:     Math.round(walkSec / 60),
    transit_minutes:  Math.round(transitSec / 60),
    transfers:        routeResult.transferCount,
    wait_pct:         Math.round((waitSec / totalSec) * 100),
    legs,
    next_departure_sec: routeResult.legs?.[0]?.edge?.depart || routeResult.departureTime,
  };
}

function buildTransitLeg(fromStop, toStop, tripId, depart, arrive, nextEdge, stopMap) {
  return {
    type:        'bus', // will be enriched with actual route type later
    trip:        tripId,
    from:        stopMap[fromStop]?.name || fromStop,
    to:          stopMap[toStop]?.name   || toStop,
    durationSec: arrive - depart,
    startTime:   depart,
    endTime:     arrive,
  };
}

// ── Min Heap (priority queue for Dijkstra) ────────────────────────────────────

class MinHeap {
  constructor() { this.heap = []; }

  push(item, priority) {
    this.heap.push({ item, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0].item;
    const last = this.heap.pop();
    if (this.heap.length) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  isEmpty() { return this.heap.length === 0; }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
