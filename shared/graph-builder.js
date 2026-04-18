// shared/graph-builder.js
// ── Parses GTFS static feed and writes chunked graph to KV ───────────────────
//
// KV output:
//   stops:{city}              → { stop_id: { lat, lon, name } }
//   meta:{city}               → { chunk_count, stop_count, built_at, route_count }
//   graph:{city}:chunk:{n}    → [ ...edges ]
//   trips:{city}:{route_id}   → [ ...stop_times ordered by departure ]
//
// Chunk strategy:
//   - Hash stop_id into N buckets (target ~2MB per chunk)
//   - All outgoing edges from stops in bucket N → chunk N
//   - Never shard by geography (trips cross boundaries)

// ── Constants ─────────────────────────────────────────────────────────────────

const CHUNK_SIZE       = 500;   // stops per chunk (safe for ~2MB)
const WALK_SPEED_MPS   = 1.33;  // meters per second (avg walking speed)
const MAX_WALK_METERS  = 400;   // max walking transfer distance
const MAX_WALK_SECONDS = Math.round(MAX_WALK_METERS / WALK_SPEED_MPS); // ~300s

// ── Main entry point ──────────────────────────────────────────────────────────

export async function buildAndStoreGraph(cityId, gtfsZip, kv) {
  console.log(`[graph-builder] Building graph for ${cityId}`);

  // 1. Parse all GTFS tables we need
  const [stops, stopTimes, trips, routes, transfers] = await Promise.all([
    parseCSV(gtfsZip, 'stops.txt'),
    parseCSV(gtfsZip, 'stop_times.txt'),
    parseCSV(gtfsZip, 'trips.txt'),
    parseCSV(gtfsZip, 'routes.txt'),
    parseCSVSafe(gtfsZip, 'transfers.txt'),
  ]);

  console.log(`[graph-builder] ${cityId}: ${stops.length} stops, ${stopTimes.length} stop_times`);

  // 2. Build stop lookup
  const stopMap = buildStopMap(stops);

  // 3. Build trip → route lookup
  const tripRouteMap = {};
  trips.forEach(t => { tripRouteMap[t.trip_id] = t.route_id; });

  // 4. Build route → type lookup (rail vs bus)
  const routeTypeMap = {};
  routes.forEach(r => { routeTypeMap[r.route_id] = parseInt(r.route_type); });

  // 5. Group stop_times by trip, sorted by stop_sequence
  const tripStops = groupTripStops(stopTimes);

  // 6. Build edges
  const edges = [];

  // Bus/rail edges from stop_times
  buildTransitEdges(edges, tripStops, tripRouteMap, routeTypeMap);

  // Walking transfer edges between nearby stops
  buildWalkingEdges(edges, stopMap);

  // Explicit transfer edges from transfers.txt if present
  if (transfers?.length) {
    buildExplicitTransfers(edges, transfers, stopMap);
  }

  console.log(`[graph-builder] ${cityId}: ${edges.length} total edges`);

  // 7. Chunk edges by source stop hash
  const stopIds   = Object.keys(stopMap);
  const chunkMap  = assignChunks(stopIds, CHUNK_SIZE);
  const chunks    = buildChunks(edges, chunkMap);
  const chunkCount = Object.keys(chunks).length;

  // 8. Write trips per route (for schedule lookup)
  const routeTrips = groupRouteTrips(tripStops, tripRouteMap);

  // 9. Write everything to KV
  await writeToKV(cityId, stopMap, chunks, routeTrips, chunkCount, kv);

  return {
    stop_count:   stopIds.length,
    edge_count:   edges.length,
    chunk_count:  chunkCount,
    route_count:  Object.keys(routeTrips).length,
  };
}

// ── Stop Map ──────────────────────────────────────────────────────────────────

function buildStopMap(stops) {
  const map = {};
  stops.forEach(s => {
    const lat = parseFloat(s.stop_lat);
    const lon = parseFloat(s.stop_lon);
    if (!s.stop_id || isNaN(lat) || isNaN(lon)) return;
    map[s.stop_id] = {
      lat,
      lon,
      name: s.stop_name || s.stop_id,
    };
  });
  return map;
}

// ── Transit Edges (bus / rail legs) ──────────────────────────────────────────

function buildTransitEdges(edges, tripStops, tripRouteMap, routeTypeMap) {
  for (const [tripId, stops] of Object.entries(tripStops)) {
    const routeId  = tripRouteMap[tripId];
    const routeType = routeTypeMap[routeId] ?? 3; // default bus

    // Determine mode from GTFS route_type
    // 0 = tram, 1 = subway, 2 = rail, 3 = bus, 4 = ferry, 11 = trolleybus
    const mode = routeType <= 2 ? 'rail' : 'bus';

    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i];
      const to   = stops[i + 1];

      const departSec = timeToSeconds(from.departure_time || from.arrival_time);
      const arriveSec = timeToSeconds(to.arrival_time   || to.departure_time);

      if (isNaN(departSec) || isNaN(arriveSec)) continue;
      if (arriveSec <= departSec) continue; // skip bad data

      edges.push({
        type:    mode,
        from:    from.stop_id,
        to:      to.stop_id,
        route:   routeId,
        trip:    tripId,
        depart:  departSec,   // seconds since midnight
        arrive:  arriveSec,
        seq:     i,
      });
    }
  }
}

// ── Walking Edges (nearby stops) ──────────────────────────────────────────────

function buildWalkingEdges(edges, stopMap) {
  const stopList = Object.entries(stopMap);

  // O(n²) — fine for Sacramento (~1k stops), manageable for NYC (~15k)
  // For very large cities consider spatial index (geohash grid)
  for (let i = 0; i < stopList.length; i++) {
    const [idA, stopA] = stopList[i];

    for (let j = i + 1; j < stopList.length; j++) {
      const [idB, stopB] = stopList[j];

      const distM = haversineMeters(stopA.lat, stopA.lon, stopB.lat, stopB.lon);
      if (distM > MAX_WALK_METERS) continue;

      const walkSec = Math.round(distM / WALK_SPEED_MPS);

      // Walking is bidirectional
      edges.push({ type: 'walk', from: idA, to: idB, duration: walkSec, distance: Math.round(distM) });
      edges.push({ type: 'walk', from: idB, to: idA, duration: walkSec, distance: Math.round(distM) });
    }
  }
}

// ── Explicit Transfers ────────────────────────────────────────────────────────

function buildExplicitTransfers(edges, transfers, stopMap) {
  transfers.forEach(t => {
    if (!stopMap[t.from_stop_id] || !stopMap[t.to_stop_id]) return;
    const transferType = parseInt(t.transfer_type);

    // type 0/1 = recommended/timed transfer, type 2 = minimum time required
    const minTransferSec = transferType === 2
      ? parseInt(t.min_transfer_time) || 120
      : 120; // default 2 min transfer

    edges.push({
      type:     'transfer',
      from:     t.from_stop_id,
      to:       t.to_stop_id,
      duration: minTransferSec,
    });
  });
}

// ── Chunking ──────────────────────────────────────────────────────────────────

// Assign each stop_id to a chunk number via simple hash
function assignChunks(stopIds, chunkSize) {
  const map = {};
  const chunkCount = Math.ceil(stopIds.length / chunkSize);

  stopIds.forEach(id => {
    // djb2 hash for even distribution
    let hash = 5381;
    for (const ch of id) hash = ((hash * 33) ^ ch.charCodeAt(0)) >>> 0;
    map[id] = hash % chunkCount;
  });

  return map;
}

// Group edges into chunks based on their source stop's chunk assignment
function buildChunks(edges, chunkMap) {
  const chunks = {};

  edges.forEach(edge => {
    const chunkId = chunkMap[edge.from];
    if (chunkId === undefined) return; // orphan stop, skip

    if (!chunks[chunkId]) chunks[chunkId] = [];
    chunks[chunkId].push(edge);
  });

  return chunks;
}

// ── Route Trips ───────────────────────────────────────────────────────────────

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

// ── KV Writes ─────────────────────────────────────────────────────────────────

async function writeToKV(cityId, stopMap, chunks, routeTrips, chunkCount, kv) {
  const writes = [];

  // stops:{city}
  writes.push(
    kv.put(`stops:${cityId}`, JSON.stringify(stopMap))
  );

  // graph:{city}:chunk:{n}
  for (const [chunkId, edges] of Object.entries(chunks)) {
    writes.push(
      kv.put(`graph:${cityId}:chunk:${chunkId}`, JSON.stringify(edges))
    );
  }

  // trips:{city}:{route_id} — batched by route
  for (const [routeId, trips] of Object.entries(routeTrips)) {
    // Sanitize route_id for KV key (remove special chars)
    const safeRouteId = routeId.replace(/[^a-zA-Z0-9_-]/g, '_');
    writes.push(
      kv.put(`trips:${cityId}:${safeRouteId}`, JSON.stringify(trips))
    );
  }

  // meta:{city}
  writes.push(
    kv.put(`meta:${cityId}`, JSON.stringify({
      chunk_count:  chunkCount,
      stop_count:   Object.keys(stopMap).length,
      route_count:  Object.keys(routeTrips).length,
      built_at:     new Date().toISOString(),
    }))
  );

  // Write in parallel batches of 10 (KV rate limit safe)
  for (let i = 0; i < writes.length; i += 10) {
    await Promise.all(writes.slice(i, i + 10));
  }

  console.log(`[graph-builder] Wrote ${writes.length} KV entries for ${cityId}`);
}

// ── GTFS Parsing (reused from gtfs-score-cron) ────────────────────────────────

function groupTripStops(stopTimes) {
  const trips = {};
  stopTimes.forEach(st => {
    if (!trips[st.trip_id]) trips[st.trip_id] = [];
    trips[st.trip_id].push(st);
  });
  // Sort each trip by stop_sequence
  for (const tripId of Object.keys(trips)) {
    trips[tripId].sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
  }
  return trips;
}

function timeToSeconds(timeStr) {
  if (!timeStr) return NaN;
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

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

export async function parseCSV(gtfsZip, filename) {
  const text = await extractFileFromZip(gtfsZip, filename);
  if (!text) throw new Error(`${filename} not found in GTFS zip`);
  return csvToObjects(text);
}

export async function parseCSVSafe(gtfsZip, filename) {
  try { return await parseCSV(gtfsZip, filename); }
  catch { return null; }
}

function csvToObjects(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].replace(/\r/g, '').split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line.replace(/\r/g, ''));
    const obj = {};
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

export async function extractFileFromZip(buffer, targetFilename) {
  const bytes = new Uint8Array(buffer);
  const view  = new DataView(buffer);
  let offset  = 0;

  while (offset < bytes.length - 4) {
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) break;

    const compression  = view.getUint16(offset + 8,  true);
    const compressedSz = view.getUint32(offset + 18, true);
    const filenameLen  = view.getUint16(offset + 26, true);
    const extraLen     = view.getUint16(offset + 28, true);

    const filename = new TextDecoder().decode(
      bytes.slice(offset + 30, offset + 30 + filenameLen)
    );

    const dataStart      = offset + 30 + filenameLen + extraLen;
    const compressedData = bytes.slice(dataStart, dataStart + compressedSz);

    if (filename === targetFilename || filename.endsWith('/' + targetFilename)) {
      if (compression === 0) {
        return new TextDecoder().decode(compressedData);
      } else if (compression === 8) {
        const ds = new DecompressionStream('deflate-raw');
        const writer = ds.writable.getWriter();
        writer.write(compressedData);
        writer.close();
        const out = await new Response(ds.readable).arrayBuffer();
        return new TextDecoder().decode(out);
      }
      throw new Error(`Unsupported compression: ${compression}`);
    }

    offset = dataStart + compressedSz;
  }
  return null;
}
