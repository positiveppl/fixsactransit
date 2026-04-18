import { fetchAllScores, CityScore } from './lib/api'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatStrip from './components/StatStrip'
import TransitCanvas from './components/TransitCanvas'
import CodeBlock from './components/CodeBlock'
import Sidebar from './components/Sidebar'
import TripPlanner from './components/TripPlanner'
import Manifesto from './components/Manifesto'

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

      {/* Main content: canvas + code left, sidebar right */}
      <div className="content-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48 }}>
        <div>
          <TransitCanvas />
          <CodeBlock sac={sac} />
        </div>
        <Sidebar sac={sac} allCities={cities} />
      </div>

      <TripPlanner sac={sac} />
      <Manifesto />
    </main>
  )
}
