// shared/realtime.js
// ── GTFS-RT realtime feed fetcher and edge patcher ───────────────────────────
//
// Fetches GTFS Realtime protobuf feeds for each city,
// decodes trip updates + vehicle positions,
// writes to KV: realtime:{city}
// Patches graph edges with live delays before routing.
//
// KV key: realtime:{city}
// TTL: 30 seconds (GTFS-RT feeds update every 15-30s)
//
// Note: GTFS-RT uses protobuf encoding. We decode it manually
// without a protobuf library — Cloudflare Workers have no npm deps.

import { CITIES } from './cities.js';

// ── Fetch and store realtime data for a city ──────────────────────────────────

export async function fetchAndStoreRealtime(city, kv, env) {
  if (!city.gtfs_rt) return null;

  try {
    const feedUrl = buildFeedUrl(city, env);
    if (!feedUrl) return null;

    const res = await fetch(feedUrl, {
      headers: buildHeaders(city, env),
      cf: { cacheTtl: 15 }, // Cloudflare edge cache 15s
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[realtime] ${city.id}: feed returned ${res.status}`);
      return null;
    }

    const buffer = await res.arrayBuffer();

    // Decode protobuf manually
    const feed = decodeGTFSRT(buffer);
    if (!feed) return null;

    // Extract what we need
    const tripUpdates        = extractTripUpdates(feed);
    const vehiclePositions   = extractVehiclePositions(feed);

    const realtimeData = {
      city_id:           city.id,
      fetched_at:        new Date().toISOString(),
      trip_updates:      tripUpdates,
      vehicle_positions: vehiclePositions,
      vehicle_count:     vehiclePositions.length,
    };

    // Store with 60s TTL — stale realtime data is worse than no data
    await kv.put(`realtime:${city.id}`, JSON.stringify(realtimeData), { expirationTtl: 60 });

    return realtimeData;

  } catch (err) {
    console.warn(`[realtime] ${city.id}: ${err.message}`);
    return null;
  }
}

// ── Apply realtime delays to graph edges ──────────────────────────────────────
// Call this before routing to get delay-adjusted results

export async function patchEdgesWithRealtime(edges, cityId, kv) {
  const realtimeData = await kv.get(`realtime:${cityId}`, 'json');
  if (!realtimeData) return edges; // no realtime data, use schedule

  // Check freshness — reject if older than 2 minutes
  const fetchedAt = new Date(realtimeData.fetched_at);
  if (Date.now() - fetchedAt.getTime() > 120_000) return edges;

  const { trip_updates } = realtimeData;
  if (!trip_updates?.length) return edges;

  // Build delay lookup: tripId:stopId → delay_seconds
  const delayMap = {};
  trip_updates.forEach(update => {
    update.stop_time_updates?.forEach(stu => {
      const key = `${update.trip_id}:${stu.stop_id}`;
      delayMap[key] = stu.arrival_delay || stu.departure_delay || 0;
    });
  });

  // Patch edge departure/arrival times
  return edges.map(edge => {
    if (edge.type !== 'bus' && edge.type !== 'rail') return edge;

    const delayKey = `${edge.trip}:${edge.from}`;
    const delaySec = delayMap[delayKey] || 0;

    if (delaySec === 0) return edge;

    return {
      ...edge,
      depart: edge.depart + delaySec,
      arrive: edge.arrive + delaySec,
      delay:  delaySec,
    };
  });
}

// ── Get vehicle positions for map visualization ───────────────────────────────

export async function getVehiclePositions(cityId, kv) {
  const data = await kv.get(`realtime:${cityId}`, 'json');
  if (!data) return { vehicles: [], fetched_at: null, city_id: cityId };

  return {
    city_id:    cityId,
    fetched_at: data.fetched_at,
    vehicles:   data.vehicle_positions || [],
    count:      data.vehicle_count || 0,
  };
}

// ── GTFS-RT Protobuf Decoder ──────────────────────────────────────────────────
// Minimal manual protobuf decoder — no dependencies
// Handles the fields we need from FeedMessage

function decodeGTFSRT(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    return decodeFeedMessage(bytes, 0, bytes.length);
  } catch (err) {
    console.warn('[realtime] Protobuf decode failed:', err.message);
    return null;
  }
}

function decodeFeedMessage(bytes, start, end) {
  const message = { header: null, entity: [] };
  let offset = start;

  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;

    if (fieldNumber === 1) {
      // FeedHeader
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      message.header = decodeFeedHeader(bytes, o, o + len);
      offset = o + len;
    } else if (fieldNumber === 2) {
      // FeedEntity (repeated)
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      const entity = decodeFeedEntity(bytes, o, o + len);
      if (entity) message.entity.push(entity);
      offset = o + len;
    } else {
      offset = skipField(bytes, offset, wireType);
    }
  }

  return message;
}

function decodeFeedHeader(bytes, start, end) {
  const header = {};
  let offset = start;
  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;
    if (fieldNumber === 1) {
      const { value, newOffset: o } = readString(bytes, offset);
      header.gtfs_realtime_version = value;
      offset = o;
    } else if (fieldNumber === 3) {
      const { value, newOffset: o } = readVarint(bytes, offset);
      header.timestamp = value;
      offset = o;
    } else {
      offset = skipField(bytes, offset, wireType);
    }
  }
  return header;
}

function decodeFeedEntity(bytes, start, end) {
  const entity = { id: null, tripUpdate: null, vehicle: null };
  let offset = start;

  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;

    if (fieldNumber === 1) {
      const { value, newOffset: o } = readString(bytes, offset);
      entity.id = value;
      offset = o;
    } else if (fieldNumber === 3) {
      // TripUpdate
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      entity.tripUpdate = decodeTripUpdate(bytes, o, o + len);
      offset = o + len;
    } else if (fieldNumber === 4) {
      // VehiclePosition
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      entity.vehicle = decodeVehiclePosition(bytes, o, o + len);
      offset = o + len;
    } else {
      offset = skipField(bytes, offset, wireType);
    }
  }

  return entity;
}

function decodeTripUpdate(bytes, start, end) {
  const tu = { trip: {}, stopTimeUpdate: [] };
  let offset = start;

  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;

    if (fieldNumber === 1) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      tu.trip = decodeTripDescriptor(bytes, o, o + len);
      offset = o + len;
    } else if (fieldNumber === 2) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      tu.stopTimeUpdate.push(decodeStopTimeUpdate(bytes, o, o + len));
      offset = o + len;
    } else {
      offset = skipField(bytes, offset, wireType);
    }
  }

  return tu;
}

function decodeTripDescriptor(bytes, start, end) {
  const td = {};
  let offset = start;
  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;
    if (fieldNumber === 1) { const { value, newOffset: o } = readString(bytes, offset); td.trip_id = value; offset = o; }
    else if (fieldNumber === 3) { const { value, newOffset: o } = readString(bytes, offset); td.route_id = value; offset = o; }
    else { offset = skipField(bytes, offset, wireType); }
  }
  return td;
}

function decodeStopTimeUpdate(bytes, start, end) {
  const stu = { stop_sequence: null, stop_id: null, arrival_delay: 0, departure_delay: 0 };
  let offset = start;
  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;
    if (fieldNumber === 1) { const { value, newOffset: o } = readVarint(bytes, offset); stu.stop_sequence = value; offset = o; }
    else if (fieldNumber === 4) { const { value, newOffset: o } = readString(bytes, offset); stu.stop_id = value; offset = o; }
    else if (fieldNumber === 2) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      const { value: delay } = readVarint(bytes, o); // arrival.delay
      stu.arrival_delay = signedVarint(delay);
      offset = o + len;
    }
    else if (fieldNumber === 3) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      const { value: delay } = readVarint(bytes, o); // departure.delay
      stu.departure_delay = signedVarint(delay);
      offset = o + len;
    }
    else { offset = skipField(bytes, offset, wireType); }
  }
  return stu;
}

function decodeVehiclePosition(bytes, start, end) {
  const vp = { trip: {}, position: {}, vehicle: {} };
  let offset = start;
  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;
    if (fieldNumber === 1) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      vp.trip = decodeTripDescriptor(bytes, o, o + len);
      offset = o + len;
    } else if (fieldNumber === 2) {
      const { value: len, newOffset: o } = readVarint(bytes, offset);
      vp.position = decodePosition(bytes, o, o + len);
      offset = o + len;
    } else {
      offset = skipField(bytes, offset, wireType);
    }
  }
  return vp;
}

function decodePosition(bytes, start, end) {
  const pos = { latitude: 0, longitude: 0 };
  let offset = start;
  while (offset < end) {
    const { fieldNumber, wireType, newOffset } = readTag(bytes, offset);
    offset = newOffset;
    if (fieldNumber === 1) { pos.latitude  = readFloat(bytes, offset); offset += 4; }
    else if (fieldNumber === 2) { pos.longitude = readFloat(bytes, offset); offset += 4; }
    else { offset = skipField(bytes, offset, wireType); }
  }
  return pos;
}

// ── Extract helpers ───────────────────────────────────────────────────────────

function extractTripUpdates(feed) {
  return (feed.entity || [])
    .filter(e => e.tripUpdate)
    .map(e => ({
      trip_id:          e.tripUpdate.trip?.trip_id,
      route_id:         e.tripUpdate.trip?.route_id,
      stop_time_updates: e.tripUpdate.stopTimeUpdate || [],
    }))
    .filter(u => u.trip_id);
}

function extractVehiclePositions(feed) {
  return (feed.entity || [])
    .filter(e => e.vehicle?.position?.latitude)
    .map(e => ({
      trip_id:   e.vehicle.trip?.trip_id,
      route_id:  e.vehicle.trip?.route_id,
      lat:       e.vehicle.position.latitude,
      lon:       e.vehicle.position.longitude,
    }));
}

// ── Feed URL builder ──────────────────────────────────────────────────────────

function buildFeedUrl(city, env) {
  if (!city.rt_key_env) return city.gtfs_rt;
  const key = env[city.rt_key_env];
  if (!key) return null;
  return city.gtfs_rt.replace(`{${city.rt_key_env}}`, key);
}

function buildHeaders(city, env) {
  const headers = { 'User-Agent': 'fixsactransit.org/1.0' };
  const key = city.rt_key_env ? env[city.rt_key_env] : null;
  if (!key) return headers;
  if (city.rt_key_env === 'MTA_KEY')   headers['x-api-key'] = key;
  if (city.rt_key_env === 'WMATA_KEY') headers['api_key']   = key;
  return headers;
}

// ── Minimal Protobuf primitives ───────────────────────────────────────────────

function readTag(bytes, offset) {
  const { value, newOffset } = readVarint(bytes, offset);
  return { fieldNumber: value >>> 3, wireType: value & 0x7, newOffset };
}

function readVarint(bytes, offset) {
  let value = 0, shift = 0;
  while (offset < bytes.length) {
    const byte = bytes[offset++];
    value |= (byte & 0x7F) << shift;
    if (!(byte & 0x80)) break;
    shift += 7;
  }
  return { value: value >>> 0, newOffset: offset };
}

function signedVarint(value) {
  // ZigZag decode for sint32
  return (value >>> 1) ^ -(value & 1);
}

function readString(bytes, offset) {
  const { value: len, newOffset } = readVarint(bytes, offset);
  const value = new TextDecoder().decode(bytes.slice(newOffset, newOffset + len));
  return { value, newOffset: newOffset + len };
}

function readFloat(bytes, offset) {
  const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4);
  return view.getFloat32(0, true); // little-endian
}

function skipField(bytes, offset, wireType) {
  if (wireType === 0) { // varint
    while (bytes[offset++] & 0x80);
    return offset;
  } else if (wireType === 1) { // 64-bit
    return offset + 8;
  } else if (wireType === 2) { // length-delimited
    const { value: len, newOffset } = readVarint(bytes, offset);
    return newOffset + len;
  } else if (wireType === 5) { // 32-bit
    return offset + 4;
  }
  throw new Error(`Unknown wire type: ${wireType}`);
}
