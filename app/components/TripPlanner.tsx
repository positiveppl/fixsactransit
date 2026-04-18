'use client'
import { useState } from 'react'
import { CityScore, fmtMin } from '../lib/api'

const DEFAULT_STEPS = [
  { type: 'walk', icon: '🚶', label: 'Walk to 35th Ave & 4th stop', detail: '0.2 mi', dur: 4 },
  { type: 'wait', icon: '⏸',  label: 'Wait for Bus 51', detail: 'Next departure: ~28 min', dur: 28 },
  { type: 'bus',  icon: '🚍', label: 'Bus 51 → Downtown Transfer', detail: '14 stops', dur: 32 },
  { type: 'walk', icon: '🚶', label: 'Walk to destination', detail: '0.3 mi', dur: 5 },
]

export default function TripPlanner({ sac }: { sac: CityScore | null }) {
  const [origin, setOrigin] = useState('Oak Park, Sacramento')
  const [dest, setDest]     = useState('Downtown Sacramento')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const pain = sac?.pain_factor ?? 6.6

  async function calculate() {
    if (!origin.trim() || !dest.trim()) { setError('Enter both addresses.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false); setDone(true)
  }

  function shareOnX() {
    const text = `My Sacramento commute:\n\n🚍 ${fmtMin(sac?.transit_minutes ?? 100)} by transit\n🚗 ${fmtMin(sac?.drive_minutes ?? 15)} by car\n\n${pain}× slower — and we're the state capital.\n\nfixsactransit.org`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400')
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 9999 as const, color: '#fff', fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13, padding: '12px 20px 12px 42px', outline: 'none',
  }

  return (
    <section id="trip-planner" style={{ background: '#202020', padding: '80px 32px' }}>
      <div className="trip-planner-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>

        {/* Form */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            Calculate your pain ratio
          </div>
          <h2 style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff', marginBottom: 36, textTransform: 'uppercase' }}>
            YOUR<br /><span style={{ color: '#ea2804' }}>COMMUTE</span>
          </h2>

          {/* Origin */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', display: 'block', marginBottom: 5, fontFamily: 'JetBrains Mono, monospace' }}>From</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>📍</span>
              <input value={origin} onChange={e => setOrigin(e.target.value)} onKeyDown={e => e.key === 'Enter' && calculate()} placeholder="Oak Park, Sacramento" style={inputStyle} />
            </div>
          </div>

          {/* Swap */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            <button onClick={() => { setOrigin(dest); setDest(origin) }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9999, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 13 }}>⇅</button>
          </div>

          {/* Dest */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', display: 'block', marginBottom: 5, fontFamily: 'JetBrains Mono, monospace' }}>To</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🏁</span>
              <input value={dest} onChange={e => setDest(e.target.value)} onKeyDown={e => e.key === 'Enter' && calculate()} placeholder="Downtown Sacramento" style={inputStyle} />
            </div>
          </div>

          {error && <div style={{ fontSize: 11, color: '#ea2804', marginBottom: 10, fontFamily: 'JetBrains Mono, monospace' }}>{error}</div>}

          <button onClick={calculate} disabled={loading} style={{ width: '100%', background: loading ? 'rgba(234,40,4,0.5)' : '#ea2804', color: '#fff', border: 'none', borderRadius: 9999, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', outline: '3px solid rgba(234,40,4,0.3)', outlineOffset: 2 }}>
            {loading ? 'Routing...' : 'Calculate Pain Ratio'}
          </button>

          {!done && (
            <div style={{ marginTop: 16, padding: '14px 18px', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 16, fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>
              Live address routing in Stage 2. Currently uses Sacramento system data.
            </div>
          )}
        </div>

        {/* Result card */}
        <div style={{ opacity: done ? 1 : 0.25, transition: 'opacity 0.4s', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, overflow: 'hidden' }}>
          {/* Head */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#646464', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
              {origin.split(',')[0]} → {dest.split(',')[0]}
            </span>
            <div style={{ background: '#ea2804', color: '#fff', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 9999 }}>Live</div>
          </div>

          {/* Pain */}
          <div style={{ padding: '24px 24px 8px' }}>
            <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 88, fontWeight: 900, lineHeight: 0.85, color: '#ea2804' }}>{pain}×</div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', marginTop: 10, fontFamily: 'JetBrains Mono, monospace' }}>Times slower than driving</div>
          </div>

          {/* Times */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '14px 24px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#646464', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>By Transit</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontWeight: 900, fontSize: 30, color: '#ea2804' }}>{fmtMin(sac?.transit_minutes ?? 100)}</div>
            </div>
            <div style={{ padding: '14px 24px' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#646464', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>By Car</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontWeight: 900, fontSize: 30, color: '#fff' }}>{fmtMin(sac?.drive_minutes ?? 15)}</div>
            </div>
          </div>

          {/* Wait bar */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, marginBottom: 8 }}>
              <div style={{ height: '100%', background: '#ea2804', borderRadius: 9999, width: done ? `${sac?.wait_pct ?? 41}%` : '0%', transition: 'width 1.5s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
            <div style={{ fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: '#ea2804', fontWeight: 600 }}>{sac?.wait_pct ?? 41}%</span> of this trip is waiting — {sac?.wait_minutes ?? 41} min standing still.
            </div>
          </div>

          {/* Steps */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 24px' }}>
            {DEFAULT_STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < DEFAULT_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 11, color: s.type === 'wait' ? '#ea2804' : '#8d8d8d', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ width: 18, textAlign: 'center' }}>{s.icon}</span>
                <span style={{ flex: 1 }}>{s.label}<span style={{ display: 'block', fontSize: 9, color: '#4e4e4e', marginTop: 1 }}>{s.detail}</span></span>
                <span style={{ fontSize: 10, color: '#4e4e4e' }}>{s.dur}m</span>
              </div>
            ))}
          </div>

          {/* Share */}
          {done && (
            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
              <button onClick={shareOnX} style={{ flex: 1, background: '#ea2804', color: '#fff', border: 'none', borderRadius: 9999, padding: '11px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>Share on X</button>
              <button onClick={() => navigator.clipboard.writeText('https://fixsactransit.org')} style={{ flex: 1, background: 'transparent', color: '#8d8d8d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9999, padding: '11px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>Copy Link</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
