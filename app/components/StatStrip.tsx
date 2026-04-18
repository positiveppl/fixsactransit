'use client'
import { useEffect, useState } from 'react'
import { CityScore, fmtMin } from '../lib/api'

export default function StatStrip({ sac }: { sac: CityScore | null }) {
  const [cols, setCols] = useState('repeat(4, 1fr)')

  useEffect(() => {
    const check = () => setCols(window.innerWidth < 560 ? '1fr 1fr' : 'repeat(4, 1fr)')
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const stats = [
    { label: 'Pain Factor', value: `${sac?.pain_factor ?? 6.6}×`, color: '#ea2804', sub: 'slower than driving' },
    { label: 'Transit Time', value: fmtMin(sac?.transit_minutes ?? 100), color: '#202020', sub: `${sac?.transfers ?? 1} transfer · ${sac?.walk_minutes ?? 11} min walk` },
    { label: 'Drive Time', value: fmtMin(sac?.drive_minutes ?? 15), color: '#2b9a66', sub: 'same trip, by car' },
    { label: 'Time Waiting', value: `${sac?.wait_pct ?? 41}%`, color: '#202020', sub: 'of the trip is standing still' },
  ]

  const mobile = cols === '1fr 1fr'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: '1px solid #e5e5e5' }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: mobile ? '18px 16px' : '28px 32px',
          borderRight: (mobile ? i % 2 === 0 : i < 3) ? '1px solid #e5e5e5' : 'none',
          borderBottom: mobile && i < 2 ? '1px solid #e5e5e5' : 'none',
        }}>
          <div style={{ fontSize: 11, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
            {s.label}
          </div>
          <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: mobile ? 28 : 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 1, color: s.color }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: '#8d8d8d', marginTop: 6 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
