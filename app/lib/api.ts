export const API_BASE =
  process.env.NEXT_PUBLIC_API_GATEWAY ||
  'https://api-gateway.msgpnn.workers.dev'

export interface CityScore {
  id: string
  name: string
  state: string
  rail_feed: boolean
  score: string | null
  frequency_score: number | null
  coverage_score: number | null
  pain_score: number | null
  pain_factor: number | null
  transit_minutes: number | null
  drive_minutes: number | null
  walk_minutes: number | null
  wait_minutes: number | null
  wait_pct: number | null
  transfers: number | null
  next_departure_min: number | null
  avg_headway_minutes: number | null
  coverage_pct: number | null
  stop_count: number | null
  gtfs_computed_at: string | null
  pain_computed_at: string | null
}

export interface ScoresResponse {
  cities: CityScore[]
  methodology: {
    weights: { frequency: number; coverage: number; pain: number }
    source: string
    updated: string
  }
}

export async function fetchAllScores(): Promise<ScoresResponse> {
  const res = await fetch(`${API_BASE}/api/scores`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchCityScore(cityId: string): Promise<CityScore> {
  const res = await fetch(`${API_BASE}/api/scores/${cityId}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function fmtMin(min: number | null): string {
  if (!min) return '—'
  if (min < 60) return `${min}m`
  return `${Math.floor(min / 60)}h ${min % 60}m`
}

export function getPainLabel(pain: number): string {
  if (pain >= 7) return 'Brutal'
  if (pain >= 5) return 'Painful'
  if (pain >= 3) return 'Bad'
  if (pain >= 2) return 'Mediocre'
  return 'Acceptable'
}

export function getPainColor(pain: number): string {
  if (pain >= 6) return '#ea2804'
  if (pain >= 4) return '#dd4425'
  if (pain >= 2) return '#646464'
  return '#2b9a66'
}
