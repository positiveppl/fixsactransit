'use client'
import { useEffect, useRef, useState } from 'react'
import { CityScore } from '../lib/api'

interface CitiesProps {
  cities: CityScore[]
}

export default function Cities({ cities }: CitiesProps) {
  const [animated, setAnimated] = useState(false)
  const [mobile, setMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Sort: scored cities desc, then unscored
  const sorted = [...cities].sort((a, b) => {
    if (!a.score && !b.score) return 0
    if (!a.score) return 1
    if (!b.score) return -1
    return parseFloat(b.score) - parseFloat(a.score)
  })

  const maxScore = Math.max(
    ...sorted.map(c => parseFloat(c.score || '0')).filter(Boolean),
    10
  )

  const cols = mobile ? '1fr 52px' : '2fr 1fr 80px 80px 80px 80px'
  const headers = mobile ? ['City', 'Score'] : ['City', 'Score', 'Freq', 'Cover', 'Pain', 'Transit']

  return (
    <section id="cities" style={{ background: '#ffffff', padding: mobile ? '64px 16px' : '96px 20px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: mobile ? 32 : 64 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#bbbbbb', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            Live rankings
          </div>
          <h2
            style={{
              fontFamily: "'rb-freigeist-neue', 'Arial Black', ui-sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(32px, 6vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: '#202020',
            }}
          >
            Transit Quality<br />
            <span style={{ color: '#ea2804' }}>12 Cities</span>
          </h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: '#646464', marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>
            Score = frequency (40%) + coverage (30%) + pain ratio (30%). Live from GTFS feeds.
          </p>
        </div>

        {/* Table */}
        <div ref={ref}>
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              gap: mobile ? 4 : 8,
              padding: '8px 12px',
              borderBottom: '1px solid #e5e5e5',
              marginBottom: 4,
            }}
          >
            {headers.map(h => (
              <div key={h} style={{ fontSize: 9, letterSpacing: '0.18em', color: '#bbbbbb', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                {h}
              </div>
            ))}
          </div>

          {sorted.map((city, i) => {
            const isSac = city.id === 'sacramento'
            const score = city.score ? parseFloat(city.score) : null
            const barPct = score ? (score / maxScore) * 100 : 0
            const hasData = !!city.score

            return (
              <div
                key={city.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: cols,
                  gap: mobile ? 4 : 8,
                  padding: mobile ? '12px' : '14px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  background: isSac ? 'rgba(234,40,4,0.03)' : 'transparent',
                  borderLeft: isSac ? '3px solid #ea2804' : '3px solid transparent',
                  transition: 'background 0.2s',
                }}
              >
                {/* City name + bar */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: mobile ? 13 : 15,
                      fontWeight: isSac ? 700 : 500,
                      color: isSac ? '#ea2804' : '#202020',
                      letterSpacing: '-0.01em',
                    }}>
                      {city.name}
                    </span>
                    <span style={{ fontSize: 10, color: '#bbbbbb', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                      {city.state}
                    </span>
                    {isSac && (
                      <span style={{
                        background: '#ea2804',
                        color: 'white',
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}>
                        ← Us
                      </span>
                    )}
                    {!hasData && (
                      <span style={{
                        background: '#f0f0f0',
                        color: '#bbbbbb',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}>
                        Pending
                      </span>
                    )}
                  </div>
                  {/* Bar */}
                  <div style={{ height: 2, background: '#f0f0f0', borderRadius: 9999, position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: 0, top: 0, height: '100%',
                      width: animated ? `${barPct}%` : '0%',
                      background: isSac ? '#ea2804' : '#202020',
                      borderRadius: 9999,
                      transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`,
                    }} />
                  </div>
                </div>

                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {hasData ? (
                    <span style={{
                      fontFamily: "'rb-freigeist-neue', 'Arial Black', ui-sans-serif",
                      fontWeight: 700,
                      fontSize: mobile ? 20 : 28,
                      color: isSac ? '#ea2804' : '#202020',
                      letterSpacing: '-0.01em',
                    }}>
                      {city.score}
                    </span>
                  ) : (
                    <span style={{ fontSize: 20, color: '#e0e0e0', fontWeight: 700 }}>—</span>
                  )}
                </div>

                {/* Desktop-only columns */}
                {!mobile && <Metric val={city.frequency_score} isSac={isSac} />}
                {!mobile && <Metric val={city.coverage_score} isSac={isSac} />}
                {!mobile && <Metric val={city.pain_factor} isSac={isSac} suffix="×" invert />}
                {!mobile && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: city.transit_minutes ? '#646464' : '#e0e0e0', fontFamily: 'JetBrains Mono, monospace' }}>
                      {city.transit_minutes ? `${city.transit_minutes}m` : '—'}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: '#bbbbbb', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>
          — = data pending. Cities added as GTFS feeds are processed.
        </div>
      </div>
    </section>
  )
}

function Metric({ val, isSac, suffix = '', invert = false }: {
  val: number | null
  isSac: boolean
  suffix?: string
  invert?: boolean
}) {
  if (val === null) {
    return <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ fontSize: 12, color: '#e0e0e0' }}>—</span></div>
  }
  const isHigh = invert ? val >= 5 : val >= 7
  const isMid = invert ? val >= 3 : val >= 4
  const color = isSac && invert ? '#ea2804' : isHigh && invert ? '#ea2804' : isMid ? '#646464' : '#2b9a66'

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color, fontWeight: 500 }}>
        {val.toFixed(1)}{suffix}
      </span>
    </div>
  )
}
