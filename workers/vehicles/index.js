// workers/vehicles/index.js
// Proxies SacRT GTFS-RT vehicle positions feed, decodes protobuf, returns JSON
// Deploy: wrangler deploy --config wrangler-vehicles.toml

const SACRT_VEHICLES_URL = 'https://bustime.sacrt.com/gtfsrt/vehicles'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    try {
      const res = await fetch(SACRT_VEHICLES_URL, {
        headers: { 'User-Agent': 'fixsactransit.org/1.0' },
        cf: { cacheTtl: 15 },
      })

      if (!res.ok) {
        return json({ error: `Feed returned ${res.status}` }, 502)
      }

      const buffer = await res.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const vehicles = decodeVehicleFeed(bytes)

      return json({ vehicles, fetched_at: new Date().toISOString() })
    } catch (err) {
      return json({ error: 'Failed to fetch vehicle feed', detail: err.message }, 500)
    }
  },
}

// ── Minimal protobuf decoder for GTFS-RT FeedMessage ─────────────────────────
// Only decodes fields we need: entity > vehicle > position + trip + vehicle

function decodeVehicleFeed(bytes) {
  const vehicles = []
  const reader = new ProtoReader(bytes)

  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7

    if (fieldNum === 2 && wireType === 2) {
      // FeedEntity
      const entityBytes = reader.readBytes()
      const entity = decodeEntity(entityBytes)
      if (entity) vehicles.push(entity)
    } else {
      reader.skip(wireType)
    }
  }

  return vehicles
}

function decodeEntity(bytes) {
  const reader = new ProtoReader(bytes)
  let id = ''
  let vehicle = null

  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7

    if (fieldNum === 1 && wireType === 2) {
      id = reader.readString()
    } else if (fieldNum === 4 && wireType === 2) {
      // VehiclePosition
      vehicle = decodeVehiclePosition(reader.readBytes())
    } else {
      reader.skip(wireType)
    }
  }

  if (!vehicle?.position) return null

  return {
    id,
    route_id: vehicle.trip?.route_id ?? '',
    trip_id: vehicle.trip?.trip_id ?? '',
    vehicle_id: vehicle.vehicle?.id ?? '',
    vehicle_label: vehicle.vehicle?.label ?? '',
    latitude: vehicle.position.latitude,
    longitude: vehicle.position.longitude,
    bearing: vehicle.position.bearing ?? 0,
    speed: vehicle.position.speed ?? 0,
    timestamp: vehicle.timestamp ?? 0,
  }
}

function decodeVehiclePosition(bytes) {
  const reader = new ProtoReader(bytes)
  const result = {}

  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7

    if (fieldNum === 1 && wireType === 2) {
      result.trip = decodeTripDescriptor(reader.readBytes())
    } else if (fieldNum === 2 && wireType === 2) {
      result.vehicle = decodeVehicleDescriptor(reader.readBytes())
    } else if (fieldNum === 3 && wireType === 2) {
      result.position = decodePosition(reader.readBytes())
    } else if (fieldNum === 5 && wireType === 0) {
      result.timestamp = reader.readVarint()
    } else {
      reader.skip(wireType)
    }
  }

  return result
}

function decodeTripDescriptor(bytes) {
  const reader = new ProtoReader(bytes)
  const result = {}
  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7
    if (fieldNum === 1 && wireType === 2) result.trip_id = reader.readString()
    else if (fieldNum === 5 && wireType === 2) result.route_id = reader.readString()
    else reader.skip(wireType)
  }
  return result
}

function decodeVehicleDescriptor(bytes) {
  const reader = new ProtoReader(bytes)
  const result = {}
  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7
    if (fieldNum === 1 && wireType === 2) result.id = reader.readString()
    else if (fieldNum === 2 && wireType === 2) result.label = reader.readString()
    else reader.skip(wireType)
  }
  return result
}

function decodePosition(bytes) {
  const reader = new ProtoReader(bytes)
  const result = {}
  while (reader.pos < reader.len) {
    const tag = reader.readVarint()
    const fieldNum = tag >>> 3
    const wireType = tag & 0x7
    if (fieldNum === 1 && wireType === 5) result.latitude = reader.readFloat()
    else if (fieldNum === 2 && wireType === 5) result.longitude = reader.readFloat()
    else if (fieldNum === 3 && wireType === 5) result.bearing = reader.readFloat()
    else if (fieldNum === 4 && wireType === 1) result.odometer = reader.readDouble()
    else if (fieldNum === 5 && wireType === 5) result.speed = reader.readFloat()
    else reader.skip(wireType)
  }
  return result
}

// ── Protobuf binary reader ────────────────────────────────────────────────────

class ProtoReader {
  constructor(bytes) {
    this.bytes = bytes
    this.pos = 0
    this.len = bytes.length
  }

  readVarint() {
    let result = 0, shift = 0
    while (this.pos < this.len) {
      const byte = this.bytes[this.pos++]
      result |= (byte & 0x7f) << shift
      if (!(byte & 0x80)) break
      shift += 7
    }
    return result >>> 0
  }

  readBytes() {
    const len = this.readVarint()
    const slice = this.bytes.slice(this.pos, this.pos + len)
    this.pos += len
    return slice
  }

  readString() {
    return new TextDecoder().decode(this.readBytes())
  }

  readFloat() {
    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset + this.pos, 4)
    this.pos += 4
    return view.getFloat32(0, true)
  }

  readDouble() {
    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset + this.pos, 8)
    this.pos += 8
    return view.getFloat64(0, true)
  }

  skip(wireType) {
    if (wireType === 0) this.readVarint()
    else if (wireType === 1) this.pos += 8
    else if (wireType === 2) { const len = this.readVarint(); this.pos += len }
    else if (wireType === 5) this.pos += 4
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=15' },
  })
}
