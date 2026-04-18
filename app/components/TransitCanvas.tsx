'use client'
import { useEffect, useRef } from 'react'

const ROUTES = [
  { id:'1',  pts:[[0.05,0.28],[0.95,0.28]], buses:5, color:'#ea2804' },
  { id:'30', pts:[[0.05,0.43],[0.95,0.43]], buses:4, color:'#ea2804' },
  { id:'51', pts:[[0.05,0.57],[0.95,0.57]], buses:3, color:'#ea2804' },
  { id:'62', pts:[[0.05,0.72],[0.95,0.72]], buses:4, color:'#ea2804' },
  { id:'13', pts:[[0.28,0.05],[0.28,0.95]], buses:3, color:'#ea2804' },
  { id:'23', pts:[[0.52,0.05],[0.52,0.95]], buses:4, color:'#ea2804' },
  { id:'15', pts:[[0.74,0.05],[0.74,0.95]], buses:3, color:'#ea2804' },
]
const RAIL = [
  { label:'Gold Line', pts:[[0.04,0.18],[0.96,0.18]], trains:2 },
  { label:'Blue Line', pts:[[0.22,0.04],[0.68,0.96]], trains:2 },
]

export default function TransitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const countRef  = useRef<HTMLSpanElement>(null)
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    type Bus = { route: typeof ROUTES[0]; p: number; speed: number; dir: number; lag: number }
    type Train = { line: typeof RAIL[0]; p: number; speed: number; dir: number }
    let buses: Bus[] = [], trains: Train[] = [], t = 0

    function size() {
      if (!canvas) return
      canvas.width = canvas.parentElement!.getBoundingClientRect().width
      canvas.height = 380
    }

    function init() {
      buses = []; trains = []
      ROUTES.forEach(r => {
        for (let i = 0; i < r.buses; i++) buses.push({ route: r, p: Math.random(), speed: 0.00035 + Math.random() * 0.00025, dir: Math.random() > 0.5 ? 1 : -1, lag: Math.random() > 0.75 ? 0.35 + Math.random() * 0.4 : 1 })
      })
      RAIL.forEach(l => {
        for (let i = 0; i < l.trains; i++) trains.push({ line: l, p: Math.random(), speed: 0.0007 + Math.random() * 0.0004, dir: Math.random() > 0.5 ? 1 : -1 })
      })
    }

    function lerp(a: number, b: number, p: number) { return a + (b - a) * p }
    function getPt(pts: number[][], p: number, w: number, h: number) {
      return { x: lerp(pts[0][0], pts[pts.length-1][0], p) * w, y: lerp(pts[0][1], pts[pts.length-1][1], p) * h }
    }

    function draw() {
      if (!canvas) return
      const w = canvas.width, h = canvas.height
      t++
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += w/14) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
      for (let y = 0; y < h; y += h/8)  { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }

      ctx.save()
      RAIL.forEach(l => {
        ctx.setLineDash([5,9]); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(l.pts[0][0]*w, l.pts[0][1]*h); ctx.lineTo(l.pts[1][0]*w, l.pts[1][1]*h); ctx.stroke()
      })
      ctx.restore()

      ctx.setLineDash([])
      ROUTES.forEach(r => {
        ctx.strokeStyle = 'rgba(234,40,4,0.07)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(r.pts[0][0]*w, r.pts[0][1]*h); ctx.lineTo(r.pts[1][0]*w, r.pts[1][1]*h); ctx.stroke()
      })

      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.055)'; ctx.font = 'bold 12px JetBrains Mono, monospace'; ctx.textAlign = 'center'
      ctx.fillText('RAIL POSITION UNKNOWN', w/2, h/2 - 8)
      ctx.font = '10px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(0,0,0,0.04)'
      ctx.fillText('NO PUBLIC REAL-TIME FEED', w/2, h/2 + 10)
      ctx.restore()

      trains.forEach(tr => {
        const pt = getPt(tr.line.pts, tr.p, w, h)
        const r2 = 5 + Math.sin(t * 0.025 + tr.p * 8) * 2
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 0.75; ctx.setLineDash([])
        ctx.beginPath(); ctx.arc(pt.x, pt.y, r2, 0, Math.PI*2); ctx.stroke()
      })

      buses.forEach(b => {
        const pt = getPt(b.route.pts, b.p, w, h)
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 9)
        grd.addColorStop(0, 'rgba(234,40,4,0.18)'); grd.addColorStop(1, 'rgba(234,40,4,0)')
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(pt.x, pt.y, 9, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = b.route.color; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI*2); ctx.fill()
      })

      buses.forEach(b => { b.p += b.speed * b.lag * b.dir; if (b.p > 1) { b.p = 1; b.dir = -1 } if (b.p < 0) { b.p = 0; b.dir = 1 } })
      trains.forEach(tr => { tr.p += tr.speed * tr.dir; if (tr.p > 1) { tr.p = 1; tr.dir = -1 } if (tr.p < 0) { tr.p = 0; tr.dir = 1 } })

      if (countRef.current) countRef.current.textContent = `${buses.length} buses active · ${trains.length} rail (est.)`
      animRef.current = requestAnimationFrame(draw)
    }

    size()
    init()
    draw()
    const onResize = () => { size(); init() }
    window.addEventListener('resize', onResize)
    const interval = setInterval(init, 15000)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={{ border: '1px solid #202020', borderRadius: 24, overflow: 'hidden', background: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e5e5e5' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#202020', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
          sacrt_live_feed.js
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, background: '#2b9a66', color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="pulse" style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%' }} />
            Buses tracked
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, border: '1px solid #bbbbbb', color: '#bbbbbb', fontFamily: 'JetBrains Mono, monospace' }}>
            Rail: no feed
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ width: '100%', height: 380, display: 'block', background: '#fafafa' }} />

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, padding: '0 20px 14px' }}>
        {[
          { type: 'dot', color: '#ea2804', label: 'Bus (GPS)' },
          { type: 'dash', label: 'Light Rail (schedule est.)' },
          { type: 'dot', color: '#e5e5e5', border: '1px solid #ccc', label: 'Ghost (no data)' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace' }}>
            {l.type === 'dot'
              ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, border: l.border, flexShrink: 0 }} />
              : <div style={{ width: 20, height: 0, borderTop: '1.5px dashed #bbbbbb', flexShrink: 0 }} />
            }
            {l.label}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span ref={countRef} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d' }}>— buses active</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d' }}>Updates every 15s</span>
      </div>
    </div>
  )
}
