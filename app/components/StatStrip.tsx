'use client'
import { CityScore, fmtMin } from '../lib/api'

export default function StatStrip({ sac }: { sac: CityScore | null }) {
  const stats = [
    { label: 'Pain Factor', value: `${sac?.pain_factor ?? 6.6}×`, color: '#ea2804', sub: 'slower than driving' },
    { label: 'Transit Time', value: fmtMin(sac?.transit_minutes ?? 100), color: '#202020', sub: `${sac?.transfers ?? 1} transfer · ${sac?.walk_minutes ?? 11} min walk` },
    { label: 'Drive Time', value: fmtMin(sac?.drive_minutes ?? 15), color: '#2b9a66', sub: 'same trip, by car' },
    { label: 'Time Waiting', value: `${sac?.wait_pct ?? 41}%`, color: '#202020', sub: 'of the trip is standing still' },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      borderBottom: '1px solid #e5e5e5',
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: '28px 32px',
          borderRight: i < stats.length - 1 ? '1px solid #e5e5e5' : 'none',
        }}>
          <div style={{ fontSize: 11, color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
            {s.label}
          </div>
          <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 1, color: s.color }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: '#8d8d8d', marginTop: 6 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
