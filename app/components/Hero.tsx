'use client'
import { CityScore, fmtMin } from '../lib/api'

export default function Hero({ sac }: { sac: CityScore | null }) {
  const transitMin = sac?.transit_minutes ?? 100
  const driveMin = sac?.drive_minutes ?? 15

  return (
    <section style={{
      background: 'linear-gradient(135deg, #ea2804 0%, #cc1a00 20%, #a01060 50%, #d02080 75%, #ff6090 100%)',
      padding: '80px 32px 96px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,200,0,0.08) 0%, transparent 50%)',
      }} />

      {/* Eyebrow */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.15)', color: '#fff',
        fontSize: 12, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em',
        padding: '6px 18px', borderRadius: 9999, marginBottom: 32, textTransform: 'uppercase',
        position: 'relative',
      }}>
        <div className="pulse" style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%' }} />
        Sacramento Regional Transit · Real-Time Analysis
      </div>

      <h1 style={{
        fontFamily: 'Arial Black, Impact, ui-sans-serif',
        fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: 900, color: '#fff',
        lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase',
        marginBottom: 24, position: 'relative',
      }}>
        The Capital<br />Can't Move.
      </h1>

      <p style={{
        fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'rgba(255,255,255,0.85)',
        maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.5, position: 'relative',
      }}>
        Sacramento is the capital of the 5th largest economy on Earth.
        A {fmtMin(driveMin)} drive is currently {fmtMin(transitMin)} by transit.
        We built a tool to make that impossible to ignore.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
        <a href="#trip-planner" style={{
          background: '#202020', color: '#fcfcfc', fontSize: 15, fontWeight: 600,
          padding: '12px 28px', borderRadius: 9999, border: 'none', cursor: 'pointer',
          outline: '4px solid #202020', textDecoration: 'none', display: 'inline-block',
        }}>
          Calculate Yours
        </a>
        <a href="#cities" style={{
          background: '#ffffff', color: '#202020', fontSize: 15, fontWeight: 600,
          padding: '12px 28px', borderRadius: 9999, border: '1px solid #202020',
          cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
        }}>
          Compare Cities
        </a>
      </div>
    </section>
  )
}
