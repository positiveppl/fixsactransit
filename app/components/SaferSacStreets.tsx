'use client'
import { useEffect, useState } from 'react'

// Current Sacramento metrics (live from API or fallback)
interface Props {
  avgHeadwayMinutes?: number
  frequencyScore?: number
  compositeScore?: number
}

// Scoring logic mirrored from cities.js
function normalizeHeadway(headway: number): number {
  const best = 5, worst = 45
  const clamped = Math.max(Math.min(headway, worst), best)
  return Math.round(((worst - clamped) / (worst - best)) * 100) / 10
}

function computeComposite(headway: number, coverage: number, pain: number): number {
  const freqScore = normalizeHeadway(headway)
  // coverage and pain kept constant for the projection
  return parseFloat((freqScore * 0.4 + coverage * 0.3 + pain * 0.3).toFixed(1))
}

const CURRENT_HEADWAY = 28.3
const PROJECTED_HEADWAY = 14
const CURRENT_COVERAGE_SCORE = 10   // Sacramento's current coverage score
const CURRENT_PAIN_SCORE = 7.7      // Sacramento's current pain score

export default function SaferSacStreets({
  avgHeadwayMinutes = CURRENT_HEADWAY,
  frequencyScore = 4.2,
  compositeScore = 7.0,
}: Props) {
  const [mobile, setMobile] = useState(false)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const projectedFreqScore = normalizeHeadway(PROJECTED_HEADWAY)
  const projectedComposite = computeComposite(
    PROJECTED_HEADWAY,
    CURRENT_COVERAGE_SCORE,
    CURRENT_PAIN_SCORE
  )

  const mono: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  }

  const label: React.CSSProperties = {
    ...mono,
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#8d8d8d',
    marginBottom: 6,
  }

  const bigNum = (color = '#202020'): React.CSSProperties => ({
    fontFamily: 'Arial Black, Impact, ui-sans-serif',
    fontSize: mobile ? 32 : 44,
    fontWeight: 900,
    lineHeight: 1,
    color,
  })

  const arrow = animated ? '→' : '→'

  return (
    <section style={{
      borderTop: '1px solid #e5e5e5',
      borderBottom: '1px solid #e5e5e5',
      padding: mobile ? '32px 16px' : '48px 40px',
      background: '#fcfcfc',
    }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-block',
          background: '#ea2804',
          color: '#fff',
          ...mono,
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          marginBottom: 14,
        }}>
          Nov 2026 Ballot
        </div>
        <h2 style={{
          fontFamily: 'Arial Black, Impact, ui-sans-serif',
          fontSize: mobile ? 22 : 28,
          fontWeight: 900,
          lineHeight: 1.15,
          margin: 0,
          color: '#202020',
        }}>
          What would change this score?
        </h2>
        <p style={{
          marginTop: 12,
          fontSize: 14,
          color: '#4e4e4e',
          lineHeight: 1.6,
          maxWidth: 560,
        }}>
          The <strong>Safer Sac Streets measure</strong> is a half-cent sales tax on the November 2026 ballot
          generating $75M/year — half dedicated to more frequent bus and light rail service.
          Here's what the math looks like if headways improve.
        </p>
      </div>

      {/* Score projection panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr auto 1fr',
        gap: mobile ? 0 : 0,
        border: '1px solid #e5e5e5',
        background: '#fff',
        marginBottom: 32,
      }}>

        {/* Current */}
        <div style={{ padding: mobile ? '24px 20px' : '32px 36px', borderBottom: mobile ? '1px solid #e5e5e5' : 'none' }}>
          <div style={label}>Current</div>
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Avg headway</div>
            <div style={bigNum('#ea2804')}>{avgHeadwayMinutes} min</div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Frequency score</div>
            <div style={bigNum()}>{frequencyScore}<span style={{ fontSize: 16, fontWeight: 400, color: '#8d8d8d' }}>/10</span></div>
          </div>
          <div>
            <div style={label}>Composite score</div>
            <div style={bigNum()}>{compositeScore}<span style={{ fontSize: 16, fontWeight: 400, color: '#8d8d8d' }}>/10</span></div>
          </div>
        </div>

        {/* Arrow */}
        {!mobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            borderLeft: '1px solid #e5e5e5',
            borderRight: '1px solid #e5e5e5',
            color: '#8d8d8d',
            fontSize: 28,
          }}>
            {arrow}
          </div>
        )}

        {/* Projected */}
        <div style={{
          padding: mobile ? '24px 20px' : '32px 36px',
          background: '#f8fff8',
          position: 'relative',
        }}>
          <div style={{ ...label, color: '#2b9a66' }}>If measure passes</div>
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Avg headway</div>
            <div style={bigNum('#2b9a66')}>{PROJECTED_HEADWAY} min</div>
            <div style={{ ...mono, fontSize: 10, color: '#8d8d8d', marginTop: 4 }}>
              est. ~{(avgHeadwayMinutes ?? CURRENT_HEADWAY) - PROJECTED_HEADWAY} min reduction
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Frequency score</div>
            <div style={bigNum('#2b9a66')}>{projectedFreqScore.toFixed(1)}<span style={{ fontSize: 16, fontWeight: 400, color: '#8d8d8d' }}>/10</span></div>
            <div style={{ ...mono, fontSize: 10, color: '#2b9a66', marginTop: 4 }}>
              +{(projectedFreqScore - (frequencyScore ?? 4.2)).toFixed(1)} pts
            </div>
          </div>
          <div>
            <div style={label}>Composite score</div>
            <div style={bigNum('#2b9a66')}>{projectedComposite}<span style={{ fontSize: 16, fontWeight: 400, color: '#8d8d8d' }}>/10</span></div>
            <div style={{ ...mono, fontSize: 10, color: '#2b9a66', marginTop: 4 }}>
              +{(projectedComposite - (compositeScore ?? 7.0)).toFixed(1)} pts
            </div>
          </div>
        </div>
      </div>

      {/* Footnote + CTA */}
      <div style={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        alignItems: mobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <p style={{
          ...mono,
          fontSize: 11,
          color: '#8d8d8d',
          margin: 0,
          lineHeight: 1.6,
          maxWidth: 480,
        }}>
          Projection assumes $37.5M/year in transit funding halves current headways.
          Coverage and pain factor held constant. Frequency is 40% of composite score.
          This is a data projection, not an endorsement.
        </p>
        <a
          href="https://www.safersacstreets.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#202020',
            color: '#fff',
            ...mono,
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '12px 20px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Learn more →
        </a>
      </div>
    </section>
  )
}
