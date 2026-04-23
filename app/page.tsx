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
import { ContentGrid } from './components/ResponsiveGrid'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export default function Page() {
  const [cities, setCities] = useState<CityScore[]>([])
  const [sac, setSac] = useState<CityScore | null>(null)

  // Add this:
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
    // Re-fetch every 5 minutes
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
      <Manifesto />
    </main>
  )
}