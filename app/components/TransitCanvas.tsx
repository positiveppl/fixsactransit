// @ts-nocheck
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Vehicle {
  id: string
  route_id: string
  latitude: number
  longitude: number
  bearing?: number
  speed?: number
}

interface NodePoint {
  id: string
  routeId: string
  lat: number
  lng: number
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
  speed: number
  lastSeen: number
  hue: number
}

const FEED_URL = 'https://vehicles.msgpnn.workers.dev'
const POLL_MS = 15_000
const NODE_TTL = 90_000
const MAX_LINK_DISTANCE = 135
const CENTER_PULL = 0.018
const ELASTICITY = 0.065
const FRICTION = 0.86

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return Math.abs(h >>> 0)
}

function routeHue(routeId: string) {
  const n = parseInt(routeId, 10)
  if (Number.isNaN(n)) return 205
  return (n * 39) % 360
}

/**
 * Orbit Field projection
 * ----------------------
 * This intentionally does NOT draw a real map.
 * Lat/lng are used as input signals for a generative sculpture:
 * - longitude affects angle
 * - latitude affects radius
 * - route id creates orbital bands
 * - time adds slow movement
 */
function orbitProject(vehicle: Vehicle, W: number, H: number, time: number): [number, number] {
  const cx = W * 0.5
  const cy = H * 0.52
  const size = Math.min(W, H)

  const lngNorm = clamp((vehicle.longitude + 121.7) / 0.65, 0, 1)
  const latNorm = clamp((vehicle.latitude - 38.34) / 0.52, 0, 1)

  const route = vehicle.route_id || '0'
  const hash = hashString(`${route}-${vehicle.id}`)
  const routeHash = hashString(route)

  // ── STRETCH CONTROLS ─────────────────────────────
  const ANGLE_STRETCH = 2.8   // spreads buses around circle
  const RADIUS_STRETCH = 1.35 // pushes buses further out
  const ELLIPSE_X = 1.45      // widen horizontally
  const ELLIPSE_Y = 0.72      // flatten vertically

  const band = (routeHash % 7) / 7
  const angleBase = lngNorm * Math.PI * ANGLE_STRETCH - Math.PI * 1.4
  const angleDrift = Math.sin(time * 0.00008 + routeHash * 0.002) * 0.45
  const angle = angleBase + angleDrift + band * 0.7

  const baseRadius = lerp(size * 0.18, size * 0.52, latNorm) * RADIUS_STRETCH
  const routeRadius = Math.sin(routeHash * 0.01) * size * 0.11
  const breathing = Math.sin(time * 0.00055 + hash * 0.0002) * size * 0.05
  const radius = baseRadius + routeRadius + breathing

  const x = cx + Math.cos(angle) * radius * ELLIPSE_X
  const y = cy + Math.sin(angle) * radius * ELLIPSE_Y

  return [x, y]
}

function drawSoftBackground(ctx: CanvasRenderingContext2D, W: number, H: number, time: number, count: number) {
  const activity = clamp(count / 110, 0, 1)
  const pulse = Math.sin(time * 0.0014) * 0.5 + 0.5

  ctx.globalCompositeOperation = 'source-over'

  const g = ctx.createRadialGradient(W * 0.5, H * 0.52, 0, W * 0.5, H * 0.52, Math.max(W, H) * 0.72)
  g.addColorStop(0, `rgba(16, 18, 28, ${0.34 + activity * 0.12 + pulse * 0.04})`)
  g.addColorStop(0.42, 'rgba(5, 7, 12, 0.72)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0.98)')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Central gravity well
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const core = ctx.createRadialGradient(W * 0.5, H * 0.52, 0, W * 0.5, H * 0.52, Math.min(W, H) * 0.2)
  core.addColorStop(0, `rgba(120, 170, 255, ${0.035 + activity * 0.035})`)
  core.addColorStop(1, 'rgba(120, 170, 255, 0)')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, W, H)
  ctx.restore()
}

function drawOrbitRings(ctx: CanvasRenderingContext2D, W: number, H: number, time: number) {
  const cx = W * 0.5
  const cy = H * 0.52
  const size = Math.min(W, H)

  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.lineWidth = 1

  for (let i = 0; i < 7; i++) {
    const r = size * (0.17 + i * 0.048)
    const alpha = 0.028 + Math.sin(time * 0.0006 + i) * 0.012

    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 1.22, r * 0.78, 0, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`
    ctx.stroke()
  }

  ctx.restore()
}

function drawLinks(ctx: CanvasRenderingContext2D, nodes: NodePoint[], time: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineCap = 'round'

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d > MAX_LINK_DISTANCE) continue

      const closeness = 1 - d / MAX_LINK_DISTANCE
      const sameRoute = a.routeId && a.routeId === b.routeId
      const alpha = sameRoute ? closeness * 0.22 : closeness * 0.07
      const hue = sameRoute ? a.hue : 205 + Math.sin(time * 0.0003) * 30

      // Elastic mid-point wobble makes lines feel alive.
      const midX = (a.x + b.x) * 0.5
      const midY = (a.y + b.y) * 0.5
      const wobble = Math.sin(time * 0.002 + i * 1.3 + j * 2.1) * closeness * 18
      const nx = -dy / Math.max(d, 1)
      const ny = dx / Math.max(d, 1)

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.quadraticCurveTo(midX + nx * wobble, midY + ny * wobble, b.x, b.y)
      ctx.lineWidth = sameRoute ? 1.15 : 0.65
      ctx.strokeStyle = `hsla(${hue}, 90%, 72%, ${alpha})`
      ctx.stroke()
    }
  }

  ctx.restore()
}

function drawNodes(ctx: CanvasRenderingContext2D, nodes: NodePoint[], time: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  for (const n of nodes) {
    const age = clamp((Date.now() - n.lastSeen) / NODE_TTL, 0, 1)
    const fresh = 1 - age
    const speedGlow = clamp(n.speed / 22, 0, 1)
    const breathe = Math.sin(time * 0.004 + hashString(n.id) * 0.01) * 0.5 + 0.5
    const r = 5 + speedGlow * 8 + breathe * 2

    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.4)
    g.addColorStop(0, `hsla(${n.hue}, 95%, 82%, ${0.88 * fresh})`)
    g.addColorStop(0.32, `hsla(${n.hue}, 95%, 60%, ${0.32 * fresh})`)
    g.addColorStop(1, `hsla(${n.hue}, 95%, 55%, 0)`)

    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(n.x, n.y, r * 2.4, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = `rgba(255,255,245,${0.9 * fresh})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, 1.8 + speedGlow * 1.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'lighter'
  }

  ctx.restore()
}

function drawScanlines(ctx: CanvasRenderingContext2D, W: number, H: number, time: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.035
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1

  const gap = 8
  const offset = Math.floor((time * 0.012) % gap)
  for (let y = offset; y < H; y += gap) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  ctx.restore()
}

export default function TransitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Record<string, NodePoint>>({})
  const animRef = useRef<number>(0)

  const [busCount, setBusCount] = useState(0)
  const [activeRoutes, setActiveRoutes] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')
  const [fetchError, setFetchError] = useState(false)

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch(FEED_URL, { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)

      const data = await res.json()
      const vehicles: Vehicle[] = (data.vehicles || []).filter(
        (v: Vehicle) =>
          Number.isFinite(v.latitude) &&
          Number.isFinite(v.longitude) &&
          v.latitude > 37.8 &&
          v.latitude < 39.6 &&
          v.longitude > -122.8 &&
          v.longitude < -120.2
      )

      const canvas = canvasRef.current
      const rect = canvas?.getBoundingClientRect()
      const W = rect?.width || 1000
      const H = rect?.height || 700
      const now = Date.now()

      for (const v of vehicles) {
        const id = v.id || `${v.route_id}-${v.latitude}-${v.longitude}`
        const routeId = v.route_id || 'unknown'
        const [tx, ty] = orbitProject(v, W, H, now)
        const existing = nodesRef.current[id]
        const hue = routeHue(routeId)

        if (!existing) {
          nodesRef.current[id] = {
            id,
            routeId,
            lat: v.latitude,
            lng: v.longitude,
            x: tx,
            y: ty,
            tx,
            ty,
            vx: 0,
            vy: 0,
            speed: v.speed || 0,
            lastSeen: now,
            hue,
          }
        } else {
          existing.routeId = routeId
          existing.lat = v.latitude
          existing.lng = v.longitude
          existing.tx = tx
          existing.ty = ty
          existing.speed = v.speed || existing.speed || 0
          existing.lastSeen = now
          existing.hue = hue
        }
      }

      Object.keys(nodesRef.current).forEach(id => {
        if (now - nodesRef.current[id].lastSeen > NODE_TTL) delete nodesRef.current[id]
      })

      const routes = new Set(vehicles.map(v => v.route_id).filter(Boolean))
      setBusCount(vehicles.length)
      setActiveRoutes(routes.size)
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setFetchError(false)
    } catch {
      setFetchError(true)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function frame() {
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const now = Date.now()
      const nodes = Object.values(nodesRef.current)

      // Physics update: nodes chase their abstract target positions.
      for (const n of nodes) {
        const dx = n.tx - n.x
        const dy = n.ty - n.y

        n.vx += dx * ELASTICITY
        n.vy += dy * ELASTICITY

        // Soft gravity toward center prevents lonely buses from feeling lost.
        n.vx += (W * 0.5 - n.x) * CENTER_PULL * 0.01
        n.vy += (H * 0.52 - n.y) * CENTER_PULL * 0.01

        n.vx *= FRICTION
        n.vy *= FRICTION
        n.x += n.vx
        n.y += n.vy
      }

      drawSoftBackground(ctx, W, H, now, nodes.length)
      drawOrbitRings(ctx, W, H, now)

      if (fetchError) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = 'rgba(255, 38, 20, 0.04)'
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
      }

      drawLinks(ctx, nodes, now)
      drawNodes(ctx, nodes, now)
      drawScanlines(ctx, W, H, now)

      animRef.current = requestAnimationFrame(frame)
    }

    frame()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [fetchError])

  useEffect(() => {
    fetchVehicles()
    const timer = setInterval(fetchVehicles, POLL_MS)
    return () => clearInterval(timer)
  }, [fetchVehicles])

  const status = useMemo(() => {
    if (fetchError) return 'signal interference'
    if (!busCount) return 'waiting for movement'
    return 'live vehicle constellation'
  }, [fetchError, busCount])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 460,
        overflow: 'hidden',
        borderRadius: 24,
        background: '#000',
        boxShadow: '0 30px 90px rgba(0,0,0,0.55), inset 0 0 90px rgba(255,255,255,0.035)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at center, transparent 0%, transparent 54%, rgba(0,0,0,0.48) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 22,
          right: 22,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
          pointerEvents: 'none',
        }}
      >
        <div>
          <div
            style={{
              color: 'rgba(255,255,255,0.86)',
              fontSize: 11,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: 7,
            }}
          >
            Orbit Field
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: 10,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </div>
        </div>

        <div
          style={{
            color: fetchError ? 'rgba(255,90,70,0.9)' : 'rgba(112,255,196,0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: fetchError ? '#ff462f' : '#70ffc4',
              boxShadow: fetchError ? '0 0 14px #ff462f' : '0 0 14px #70ffc4',
            }}
          />
          SacRT Feed
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 22,
          bottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
          pointerEvents: 'none',
        }}
      >
      <div
        style={{
          position: 'absolute',
          right: 22,
          bottom: 160,
          maxWidth: 320,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          pointerEvents: 'none',
          lineHeight: 1.5,
        }}
      >
        <p style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 12
        }}>
          Every glowing point is a live SacRT vehicle. Nearby vehicles connect into a temporary network. When service is thin, the field opens up and goes dark. When routes bunch together, the system burns bright in one place while other parts disappear.
        </p>

        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 600
        }}>
          A trip that takes 15 minutes by car can take over an hour by transit. That gap is the pain.
        </p>
      </div>
        <Stat label="Vehicles" value={busCount ? String(busCount) : '—'} />
        <Stat label="Routes" value={activeRoutes ? String(activeRoutes) : '—'} />
        <Stat label="Updated" value={lastUpdate || '...'} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        minWidth: 86,
        padding: '9px 10px',
        borderRadius: 14,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: 8,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.88)',
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  )
}
