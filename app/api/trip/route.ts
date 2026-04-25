// app/api/route/route.ts
// ── Trip planner API route ────────────────────────────────────────────────────
// Runs server-side (Next.js) so no Worker memory limits.
// Loads graph chunks from Cloudflare KV via REST API, runs Dijkstra locally.
//
// POST /api/route
// Body: { originLat, originLon, destLat, destLon, cityId? }

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'  // ← add this line

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

interface DijkstraState {
  arrivalTime: number
  prev: string | null
  prevEdge: Edge | null
  walkSec: number
  transfers: number
  currentRoute: string | null
}

interface DijkstraResult {
  arrivalTime: number
  walkSec: number
  transfers: number
  originStopId: string
  destStopId: string
  best: Map<string, DijkstraState>
}

function dijkstra(
  allEdges: Edge[],
  originStops: StopWithDist[],
  destStopIds: Set<string>,
  departureTimeSec: number
): DijkstraResult | null {
  const adj = new Map<string, Edge[]>()
  for (const edge of allEdges) {
    if (!adj.has(edge.from)) adj.set(edge.from, [])
    adj.get(edge.from)!.push(edge)
  }

  const best    = new Map<string, DijkstraState>()
  const heap    = new MinHeap()
  const startTime = departureTimeSec

  // seed origin stops — each already accounts for the walk from actual origin
  const originStopIds = new Map<string, number>() // stopId → walkSec
  for (const stop of originStops) {
    const walkSec = Math.round(stop.distM / WALK_SPEED_MPS)
    const arrTime = startTime + walkSec
    best.set(stop.id, { arrivalTime: arrTime, prev: null, prevEdge: null, walkSec, transfers: 0, currentRoute: null })
    heap.push({ cost: arrTime, stopId: stop.id, walkSec, transfers: 0 })
    originStopIds.set(stop.id, walkSec)
  }

  let bestDestId: string | null = null

  while (heap.size > 0) {
    const { cost, stopId, walkSec, transfers } = heap.pop()
    const state = best.get(stopId)
    if (!state || cost > state.arrivalTime + 1) continue
    if (cost - startTime > MAX_JOURNEY_SEC) break

    if (destStopIds.has(stopId)) {
      if (!bestDestId || cost < best.get(bestDestId)!.arrivalTime) {
        bestDestId = stopId
      }
      continue
    }

    for (const edge of (adj.get(stopId) || [])) {
      let arrival      = cost
      let newWalkSec   = walkSec
      let newTransfers = transfers
      let newRoute     = state.currentRoute

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
        if (state.currentRoute && state.currentRoute !== edge.route) {
          newTransfers++
          arrival += TRANSFER_PENALTY_SEC
        }
        newRoute = edge.route ?? null
      } else if (edge.type === 'transfer') {
        const dur = edge.duration ?? edge.durationSec ?? 180
        arrival += dur + TRANSFER_PENALTY_SEC
        newTransfers++
      } else {
        continue
      }

      const existing = best.get(edge.to)
      if (!existing || arrival < existing.arrivalTime) {
        best.set(edge.to, {
          arrivalTime: arrival,
          prev: stopId,
          prevEdge: edge,
          walkSec: newWalkSec,
          transfers: newTransfers,
          currentRoute: newRoute,
        })
        heap.push({ cost: arrival, stopId: edge.to, walkSec: newWalkSec, transfers: newTransfers })
      }
    }
  }

  if (!bestDestId) return null
  const destState = best.get(bestDestId)!

  // find which origin stop this route used
  let cur = bestDestId
  while (best.get(cur)?.prev !== null) cur = best.get(cur)!.prev!
  const originStopId = cur

  return {
    arrivalTime: destState.arrivalTime,
    walkSec: destState.walkSec,
    transfers: destState.transfers,
    originStopId,
    destStopId: bestDestId,
    best,
  }
}

// ── Leg reconstruction ────────────────────────────────────────────────────────

interface Leg {
  type: 'walk' | 'wait' | 'bus' | 'rail'
  from?: string
  to?: string
  at?: string
  durationSec: number
  distanceM?: number
}

function buildLegs(
  result: DijkstraResult,
  stopMap: Record<string, Stop>,
  originStops: StopWithDist[],
  destStops: StopWithDist[],
  startTimeSec: number
): Leg[] {
  const legs: Leg[] = []
  const { best, originStopId, destStopId } = result

  // Reconstruct path edges from dest back to origin
  const pathEdges: { from: string; edge: Edge; arriveAt: number }[] = []
  let cur = destStopId
  while (best.get(cur)?.prev !== null) {
    const state = best.get(cur)!
    pathEdges.unshift({ from: state.prev!, edge: state.prevEdge!, arriveAt: state.arrivalTime })
    cur = state.prev!
  }

  // First-mile walk
  const originStop = originStops.find(s => s.id === originStopId) ?? originStops[0]
  const firstWalkSec = Math.round((originStop?.distM ?? 200) / WALK_SPEED_MPS)
  let currentTime = startTimeSec

  if (firstWalkSec > 30) {
    legs.push({ type: 'walk', to: stopMap[originStopId]?.name ?? originStopId, durationSec: firstWalkSec, distanceM: Math.round(originStop?.distM ?? 200) })
    currentTime += firstWalkSec
  }

  // Transit legs — merge consecutive same-trip edges, insert waits between legs
  let currentRoute: string | null = null
  let currentLegStart = currentTime
  let currentLegFrom  = stopMap[originStopId]?.name ?? originStopId
  let currentLegDepart = 0

  for (const { from, edge, arriveAt } of pathEdges) {
    if (edge.type === 'walk' || edge.type === 'transfer') {
      // Flush transit leg if open
      if (currentRoute) {
        legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[from]?.name ?? from, durationSec: currentTime - currentLegDepart })
        currentRoute = null
      }
      // Wait if gap
      const waitSec = Math.max(0, (edge.depart ?? currentTime) - currentTime)
      if (waitSec > 60) {
        legs.push({ type: 'wait', at: stopMap[from]?.name ?? from, durationSec: waitSec })
        currentTime += waitSec
      }
      const dur = edge.duration ?? edge.durationSec ?? 120
      legs.push({ type: 'walk', from: stopMap[from]?.name ?? from, to: stopMap[edge.to]?.name ?? edge.to, durationSec: dur, distanceM: Math.round(dur * WALK_SPEED_MPS) })
      currentTime += dur
    } else {
      // Bus/rail
      if (!currentRoute) {
        // Wait before boarding
        const waitSec = Math.max(0, (edge.depart ?? currentTime) - currentTime)
        if (waitSec > 60) {
          legs.push({ type: 'wait', at: stopMap[from]?.name ?? from, durationSec: waitSec })
        }
        currentRoute     = edge.route ?? 'bus'
        currentLegFrom   = stopMap[from]?.name ?? from
        currentLegDepart = edge.depart ?? currentTime
        currentTime      = edge.arrive ?? arriveAt
      } else if (edge.route && edge.route !== currentRoute) {
        // Transfer — flush current leg and start new one
        legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[from]?.name ?? from, durationSec: currentTime - currentLegDepart })
        currentRoute     = edge.route
        currentLegFrom   = stopMap[from]?.name ?? from
        currentLegDepart = edge.depart ?? currentTime
        currentTime      = edge.arrive ?? arriveAt
      } else {
        currentTime = edge.arrive ?? arriveAt
      }
    }
    currentLegStart = currentTime
  }

  // Flush final transit leg
  if (currentRoute && pathEdges.length) {
    const last = pathEdges[pathEdges.length - 1]
    legs.push({ type: 'bus', from: currentLegFrom, to: stopMap[last.edge.to]?.name ?? last.edge.to, durationSec: currentTime - currentLegDepart })
  }

  // Last-mile walk
  const destStop = destStops.find(s => s.id === destStopId) ?? destStops[0]
  const lastWalkSec = Math.round((destStop?.distM ?? 200) / WALK_SPEED_MPS)
  if (lastWalkSec > 30) {
    legs.push({ type: 'walk', from: stopMap[destStopId]?.name ?? destStopId, to: 'Destination', durationSec: lastWalkSec, distanceM: Math.round(destStop?.distM ?? 200) })
  }

  return legs
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

  const legs = buildLegs(result, stopMap, originStops, destStops, DEPARTURE_SEC)

  const walkSec    = legs.filter(l => l.type === 'walk').reduce((s, l) => s + l.durationSec, 0)
  const waitSec    = legs.filter(l => l.type === 'wait').reduce((s, l) => s + l.durationSec, 0)
  const busSec     = legs.filter(l => l.type === 'bus' || l.type === 'rail').reduce((s, l) => s + l.durationSec, 0)
  const totalSec   = result.arrivalTime - DEPARTURE_SEC

  const transitMin = Math.round(totalSec / 60)
  const walkMin    = Math.round(walkSec / 60)
  const waitMin    = Math.round(waitSec / 60)
  const distKm     = haversineKm(originLat, originLon, destLat, destLon)
  const driveMin   = Math.max(5, Math.round((distKm / 30) * 60))
  const painFactor = Math.round((transitMin / driveMin) * 10) / 10
  const waitPct    = totalSec > 0 ? Math.round((waitSec / totalSec) * 100) : 0

  const originStopName = stopMap[result.originStopId]?.name ?? originStops[0]?.name
  const destStopName   = stopMap[result.destStopId]?.name   ?? destStops[0]?.name

  return NextResponse.json({
    transit_minutes: transitMin,
    drive_minutes:   driveMin,
    pain_factor:     painFactor,
    walk_minutes:    walkMin,
    wait_minutes:    waitMin,
    wait_pct:        waitPct,
    transfers:       result.transfers,
    origin_stop:     originStopName,
    dest_stop:       destStopName,
    chunks_loaded:   meta.chunk_count,
    legs,
  })
}
