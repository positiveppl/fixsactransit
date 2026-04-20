// app/api/route/route.ts
// ── Trip planner API route ────────────────────────────────────────────────────
// Runs server-side (Next.js) so no Worker memory limits.
// Loads graph chunks from Cloudflare KV via REST API, runs Dijkstra locally.
//
// POST /api/route
// Body: { originLat, originLon, destLat, destLon, cityId? }

import { NextRequest, NextResponse } from 'next/server'

const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID || 'aac52192fcae4d898c2eb6d25ea8f644'
const CF_ACCOUNT_ID   = process.env.CF_ACCOUNT_ID   || '2c71d94dab62fe783bc42ebd0dedb39f'
const CF_API_TOKEN    = process.env.CF_API_TOKEN     || ''

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values`

// ── KV fetch ──────────────────────────────────────────────────────────────────

async function kvGet(key: string): Promise<unknown> {
  const res = await fetch(`${KV_BASE}/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  const text = await res.text()
  try { return JSON.parse(text) } catch { return null }
}

// ── Geo ───────────────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

interface Stop { lat: number; lon: number; name: string; chunk?: number }
interface StopWithDist extends Stop { id: string; distM: number }

function findNearestStops(stopMap: Record<string, Stop>, lat: number, lon: number, n = 3): StopWithDist[] {
  return Object.entries(stopMap)
    .map(([id, s]) => ({ id, ...s, distM: haversineKm(lat, lon, s.lat, s.lon) * 1000 }))
    .filter(s => s.distM <= 3000)
    .sort((a, b) => a.distM - b.distM)
    .slice(0, n)
}

// ── Min-heap ──────────────────────────────────────────────────────────────────

interface HeapItem { cost: number; stopId: string; walkSec: number; transfers: number }

class MinHeap {
  private h: HeapItem[] = []
  push(item: HeapItem) {
    this.h.push(item)
    let i = this.h.length - 1
    while (i > 0) {
      const p = Math.floor((i-1)/2)
      if (this.h[p].cost <= this.h[i].cost) break
      ;[this.h[p], this.h[i]] = [this.h[i], this.h[p]]
      i = p
    }
  }
  pop(): HeapItem {
    const top = this.h[0]
    const last = this.h.pop()!
    if (this.h.length > 0) {
      this.h[0] = last
      let i = 0
      while (true) {
        let s = i
        const l = 2*i+1, r = 2*i+2
        if (l < this.h.length && this.h[l].cost < this.h[s].cost) s = l
        if (r < this.h.length && this.h[r].cost < this.h[s].cost) s = r
        if (s === i) break
        ;[this.h[s], this.h[i]] = [this.h[i], this.h[s]]
        i = s
      }
    }
    return top
  }
  get size() { return this.h.length }
}

// ── Dijkstra ──────────────────────────────────────────────────────────────────

interface Edge {
  type: string; from: string; to: string
  route?: string; depart?: number; arrive?: number
  duration?: number; durationSec?: number
}

const TRANSFER_PENALTY_SEC = 300
const MAX_WALK_TOTAL_SEC   = 1200
const MAX_JOURNEY_SEC      = 10800
const WALK_SPEED_MPS       = 1.33

function dijkstra(
  allEdges: Edge[],
  originStops: StopWithDist[],
  destStopIds: Set<string>,
  departureTimeSec: number
): { arrivalTime: number; walkSec: number; transfers: number } | null {
  const adj = new Map<string, Edge[]>()
  for (const edge of allEdges) {
    if (!adj.has(edge.from)) adj.set(edge.from, [])
    adj.get(edge.from)!.push(edge)
  }

  const dist      = new Map<string, number>()
  const prevRoute = new Map<string, string | null>()
  const heap      = new MinHeap()
  const startTime = departureTimeSec

  for (const stop of originStops) {
    const walkSec = Math.round(stop.distM / WALK_SPEED_MPS)
    const arrTime = startTime + walkSec
    dist.set(stop.id, arrTime)
    heap.push({ cost: arrTime, stopId: stop.id, walkSec, transfers: 0 })
  }

  let best: { arrivalTime: number; walkSec: number; transfers: number } | null = null

  while (heap.size > 0) {
    const { cost, stopId, walkSec, transfers } = heap.pop()

    if (cost > (dist.get(stopId) ?? Infinity) + 1) continue
    if (cost - startTime > MAX_JOURNEY_SEC) break

    if (destStopIds.has(stopId)) {
      if (!best || cost < best.arrivalTime) {
        best = { arrivalTime: cost, walkSec, transfers }
      }
      continue
    }

    for (const edge of (adj.get(stopId) || [])) {
      let arrival      = cost
      let newWalkSec   = walkSec
      let newTransfers = transfers

      if (edge.type === 'walk') {
        const dur = edge.duration ?? edge.durationSec ?? 120
        newWalkSec += dur
        if (newWalkSec > MAX_WALK_TOTAL_SEC) continue
        arrival += dur
      } else if (edge.type === 'bus' || edge.type === 'rail') {
        if (edge.depart === undefined || edge.arrive === undefined) continue
        if (edge.depart < cost) continue
        if (edge.depart - cost > 7200) continue
        arrival = edge.arrive
        const lastRoute = prevRoute.get(stopId)
        if (lastRoute && lastRoute !== edge.route) {
          newTransfers++
          arrival += TRANSFER_PENALTY_SEC
        }
      } else if (edge.type === 'transfer') {
        const dur = edge.duration ?? edge.durationSec ?? 180
        arrival += dur + TRANSFER_PENALTY_SEC
        newTransfers++
      } else {
        continue
      }

      const existing = dist.get(edge.to)
      if (existing === undefined || arrival < existing) {
        dist.set(edge.to, arrival)
        prevRoute.set(edge.to, edge.route ?? null)
        heap.push({ cost: arrival, stopId: edge.to, walkSec: newWalkSec, transfers: newTransfers })
      }
    }
  }

  return best
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!CF_API_TOKEN) {
    return NextResponse.json({ error: 'CF_API_TOKEN not configured' }, { status: 503 })
  }

  let body: { originLat?: number; originLon?: number; destLat?: number; destLon?: number; cityId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { originLat, originLon, destLat, destLon, cityId = 'sacramento' } = body

  if (!originLat || !originLon || !destLat || !destLon) {
    return NextResponse.json({ error: 'Required: originLat, originLon, destLat, destLon' }, { status: 400 })
  }

  // Load stop map
  const stopMap = await kvGet(`stops:${cityId}`) as Record<string, Stop> | null
  if (!stopMap) {
    return NextResponse.json({ error: 'No graph data for this city' }, { status: 503 })
  }

  const originStops = findNearestStops(stopMap, originLat, originLon, 3)
  const destStops   = findNearestStops(stopMap, destLat, destLon, 3)

  if (!originStops.length || !destStops.length) {
    return NextResponse.json({
      error: 'No stops found near origin or destination',
      hint: 'Try an address closer to a main road or bus corridor',
    }, { status: 404 })
  }

  // Load graph metadata
  const meta = await kvGet(`meta:${cityId}`) as { chunk_count: number } | null
  if (!meta) {
    return NextResponse.json({ error: 'No graph metadata' }, { status: 503 })
  }

  // Load all chunks in parallel — no memory limit server-side
  console.log(`Loading ${meta.chunk_count} chunks for ${cityId}...`)
  const chunkPromises = Array.from({ length: meta.chunk_count }, (_, i) =>
    kvGet(`graph:${cityId}:chunk:${i}`)
  )
  const chunks = await Promise.all(chunkPromises)

  const allEdges: Edge[] = []
  for (const chunk of chunks) {
    if (!chunk) continue
    const edges = Array.isArray(chunk) ? chunk : Object.values(chunk as object)
    for (const e of edges) allEdges.push(e as Edge)
  }

  console.log(`Loaded ${allEdges.length} edges, routing...`)

  // 8am PDT = 15:00 UTC
  const DEPARTURE_SEC = 15 * 3600
  const destStopIds   = new Set(destStops.map(s => s.id))
  const result        = dijkstra(allEdges, originStops, destStopIds, DEPARTURE_SEC)

  if (!result) {
    return NextResponse.json({
      error: 'No route found',
      hint: 'No active service connecting these stops at 8am. Try different addresses.',
      origin_stop:  originStops[0]?.name,
      dest_stop:    destStops[0]?.name,
    }, { status: 404 })
  }

  const transitMin = Math.round((result.arrivalTime - DEPARTURE_SEC) / 60)
  const distKm     = haversineKm(originLat, originLon, destLat, destLon)
  const driveMin   = Math.max(5, Math.round((distKm / 30) * 60))
  const painFactor = Math.round((transitMin / driveMin) * 10) / 10
  const walkMin    = Math.round((result.walkSec || 0) / 60)
  const waitMin    = Math.max(0, Math.round((transitMin - walkMin) * 0.4))
  const waitPct    = Math.round((waitMin / transitMin) * 100)

  return NextResponse.json({
    transit_minutes: transitMin,
    drive_minutes:   driveMin,
    pain_factor:     painFactor,
    walk_minutes:    walkMin,
    wait_minutes:    waitMin,
    wait_pct:        waitPct,
    transfers:       result.transfers,
    origin_stop:     originStops[0]?.name,
    dest_stop:       destStops[0]?.name,
    chunks_loaded:   meta.chunk_count,
  })
}
