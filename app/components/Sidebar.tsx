'use client'
import { useEffect, useState } from 'react'
import { CityScore, fmtMin } from '../lib/api'

const CA_CITY_IDS = ['san_francisco', 'los_angeles', 'san_diego', 'san_jose', 'sacramento']

const INIT_DEPS = [
  { route:'51', dest:'Freeport & Sutterville', min:4 },
  { route:'23', dest:'Broadway & Land Park Dr', min:8 },
  { route:'30', dest:'Stockton Blvd & Fruitridge', min:21 },
  { route:'51', dest:'Freeport & Sutterville', min:36 },
]

export default function Sidebar({ sac, allCities }: { sac: CityScore | null; allCities: CityScore[] }) {
  const [animated, setAnimated] = useState(false)
  const [deps, setDeps] = useState(INIT_DEPS)

  useEffect(() => {
    setTimeout(() => setAnimated(true), 300)
    const iv = setInterval(() => {
      setDeps(d => d.map(dep => ({ ...dep, min: dep.min <= 0 ? 20 + Math.floor(Math.random() * 25) : dep.min - 1 })))
    }, 60000)
    return () => clearInterval(iv)
  }, [])

  // All 5 CA cities compete — Sacramento ranks by its actual live score
  const cityRows = CA_CITY_IDS
    .map(id => allCities.find(c => c.id === id))
    .filter((c): c is CityScore => !!c && !!c.score)
    .map(c => ({
      name: c.name,
      id: c.id,
      score: parseFloat(c.score!),
      pct: (parseFloat(c.score!) / 10) * 100,
      isSac: c.id === 'sacramento',
    }))
    .sort((a, b) => b.score - a.score)

  const cardStyle = { border: '1px solid #202020', borderRadius: 20, overflow: 'hidden' as const }
  const headStyle = { padding: '14px 18px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  const titleStyle = { fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#646464', letterSpacing: '0.06em', textTransform: 'uppercase' as const }
  const bodyStyle = { padding: 18 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* PAIN CARD */}
      <div style={cardStyle}>
        <div style={headStyle}>
          <span style={titleStyle}>Pain Factor</span>
          <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, border: '1px solid #ea2804', color: '#ea2804', fontFamily: 'JetBrains Mono, monospace' }}>SACRT</div>
        </div>
        <div style={bodyStyle}>
          <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 80, fontWeight: 900, lineHeight: 1, color: '#ea2804' }}>
            {sac?.pain_factor ?? 6.6}×
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#646464', lineHeight: 1.6, borderLeft: '3px solid #ea2804', paddingLeft: 12 }}>
            A {fmtMin(sac?.drive_minutes ?? 15)} drive is currently {fmtMin(sac?.transit_minutes ?? 100)} by transit.<br /><br />
            You will spend {sac?.wait_minutes ?? 41} of those minutes not riding — just waiting.
          </div>
        </div>
      </div>

      {/* TRIP COMPARE */}
      <div style={cardStyle}>
        <div style={headStyle}><span style={titleStyle}>Trip Breakdown</span></div>
        <div style={bodyStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e5e5e5', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ background: '#fff', padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Transit</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 30, fontWeight: 900, lineHeight: 1, color: '#ea2804' }}>{fmtMin(sac?.transit_minutes ?? 100)}</div>
            </div>
            <div style={{ background: '#fff', padding: '14px 16px', borderLeft: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Driving</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 30, fontWeight: 900, lineHeight: 1, color: '#2b9a66' }}>{fmtMin(sac?.drive_minutes ?? 15)}</div>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8d8d8d', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
              <span>Time waiting at stops</span>
              <strong style={{ color: '#ea2804' }}>{sac?.wait_pct ?? 41}%</strong>
            </div>
            <div style={{ height: 3, background: '#e5e5e5', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ea2804', borderRadius: 9999, width: animated ? `${sac?.wait_pct ?? 41}%` : '0%', transition: 'width 2s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
            {sac?.wait_minutes ?? 46} minutes of this trip is standing still at a stop.
          </div>
        </div>
      </div>

      {/* CITY COMPARISON */}
      <div id="cities" style={cardStyle}>
        <div style={headStyle}><span style={titleStyle}>Transit Score · CA Cities</span></div>
        <div style={bodyStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {cityRows.map((c, i) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '88px 1fr 36px', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < cityRows.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.isSac ? '#ea2804' : '#646464', fontWeight: c.isSac ? 700 : 400 }}>
                  {c.name}{c.isSac ? ' ←' : ''}
                </span>
                <div style={{ height: 3, background: '#e5e5e5', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: c.isSac ? '#ea2804' : '#202020', borderRadius: 9999, width: animated ? `${c.pct}%` : '0%', transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms` }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.isSac ? '#ea2804' : '#646464', fontWeight: c.isSac ? 700 : 400, textAlign: 'right' }}>{c.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEXT DEPARTURES */}
      <div style={cardStyle}>
        <div style={headStyle}>
          <span style={titleStyle}>Next Departures</span>
          <div style={{ display: 'inline-flex', fontSize: 10, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, background: '#2b9a66', color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>Nearest stop</div>
        </div>
        <div style={bodyStyle}>
          {deps.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < deps.length - 1 ? '1px solid #f0f0f0' : 'none', gap: 8 }}>
              <div style={{ background: '#202020', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 9999, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{d.route}</div>
              <div style={{ fontSize: 11, color: '#646464', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.dest}</div>
              <div className={d.min <= 3 ? 'blink' : ''} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: d.min <= 10 ? '#ea2804' : '#202020', fontWeight: d.min <= 10 ? 700 : 400, whiteSpace: 'nowrap' }}>
                {d.min} min{d.min <= 3 ? ' !!' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GHOST RAIL */}
      <div style={{ border: '1px solid #bbbbbb', borderRadius: 20, overflow: 'hidden', opacity: 0.7 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px dashed #bbbbbb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...titleStyle, color: '#bbbbbb' }}>Light Rail Status</span>
          <div style={{ fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, border: '1px solid #bbbbbb', color: '#bbbbbb', fontFamily: 'JetBrains Mono, monospace' }}>no feed</div>
        </div>
        <div style={{ padding: 18, background: '#fafafa' }}>
          <div style={{ fontSize: 12, color: '#646464', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>
            <strong style={{ color: '#202020' }}>42 miles of track. No public real-time data.</strong><br /><br />
            SacRT's light rail system has no live API feed. Train positions are estimated from schedules.<br /><br />
            Parts of Sacramento's transit system are <strong style={{ color: '#202020' }}>invisible — even to itself.</strong>
          </div>
        </div>
      </div>

    </div>
  )
}
