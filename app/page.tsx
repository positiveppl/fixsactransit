import { fetchAllScores, CityScore } from './lib/api'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatStrip from './components/StatStrip'
import TransitMapbox from './components/TransitMapbox'
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''
import CodeBlock from './components/CodeBlock'
import Sidebar from './components/Sidebar'
import TripPlanner from './components/TripPlanner'
import Manifesto from './components/Manifesto'
import { ContentGrid } from './components/ResponsiveGrid'

export const runtime = 'edge'
export const revalidate = 300

export default async function Page() {
  let cities: CityScore[] = []
  let sac: CityScore | null = null

  try {
    const data = await fetchAllScores()
    cities = data.cities
    sac = data.cities.find(c => c.id === 'sacramento') ?? null
  } catch (err) {
    console.error('Failed to fetch scores:', err)
  }

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
