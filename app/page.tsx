'use client'
import { useEffect, useState } from 'react'
import { fetchAllScores, CityScore } from './lib/api'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatStrip from './components/StatStrip'
import TransitMapbox from './components/TransitMapbox'
import CodeBlock from './components/CodeBlock'
import Sidebar from './components/Sidebar'
import TripPlanner from './components/TripPlanner'
import Manifesto from './components/Manifesto'
import TransitCanvas from './components/TransitCanvas'
import { ContentGrid } from './components/ResponsiveGrid'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export default function Page() {
  const [cities, setCities] = useState<CityScore[]>([])
  const [sac, setSac] = useState<CityScore | null>(null)

  console.log('Render — sac:', sac?.pain_factor, sac?.score)

  useEffect(() => {
    async function load() {
      try {
        console.log('Fetching scores...')
        const data = await fetchAllScores()
        console.log('Got data:', data.cities.find(c => c.id === 'sacramento'))
        setCities(data.cities)
        setSac(data.cities.find(c => c.id === 'sacramento') ?? null)
      } catch (err) {
        console.error('Failed to fetch scores:', err)
      }
    }
    load()
    const iv = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <main>
      <Nav />
      <Hero sac={sac} />
      <StatStrip sac={sac} />
      <ContentGrid>
        <div>
          <TransitMapbox mapboxToken={MAPBOX_TOKEN} />
          <CodeBlock sac={sac} />
        </div>
        <Sidebar sac={sac} allCities={cities} />
      </ContentGrid>
      <TripPlanner sac={sac} />

      <section style={{ background: '#000', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 8,
            }}>
              City Pulse
            </p>
            <h2 style={{
              fontFamily: 'Arial Black, Impact, ui-sans-serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              Sacramento Moving<br />in Real Time
            </h2>
          </div>

          <div style={{ height: 500, borderRadius: 16, overflow: 'hidden' }}>
            <TransitCanvas />
          </div>
        </div>
      </section>

      <Manifesto />
    </main>
  )
}
