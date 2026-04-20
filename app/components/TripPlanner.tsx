'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { CityScore, fmtMin } from '../lib/api'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

interface Suggestion {
  mapbox_id: string
  name: string
  place_formatted: string
  full_address?: string
}

interface RouteResult {
  transit_minutes: number
  drive_minutes: number
  pain_factor: number
  walk_minutes: number
  wait_minutes: number
  wait_pct: number
  transfers: number
  origin_stop: string
  dest_stop: string
}

// ── Mapbox Search Box API ─────────────────────────────────────────────────────

const SESSION_TOKEN = crypto.randomUUID()

async function getSuggestions(query: string): Promise<Suggestion[]> {
  if (!query || query.length < 2) return []
  const url = new URL('https://api.mapbox.com/search/searchbox/v1/suggest')
  url.searchParams.set('q', query)
  url.searchParams.set('access_token', MAPBOX_TOKEN)
  url.searchParams.set('session_token', SESSION_TOKEN)
  url.searchParams.set('country', 'US')
  url.searchParams.set('proximity', '-121.4944,38.5816')
  url.searchParams.set('types', 'address,street,neighborhood,place')
  url.searchParams.set('limit', '5')

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()
  return data.suggestions || []
}

async function retrieveCoords(mapboxId: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL(`https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}`)
  url.searchParams.set('access_token', MAPBOX_TOKEN)
  url.searchParams.set('session_token', SESSION_TOKEN)

  const res = await fetch(url.toString())
  if (!res.ok) return null
  const data = await res.json()
  const coords = data.features?.[0]?.geometry?.coordinates
  if (!coords) return null
  return { lat: coords[1], lon: coords[0] }
}

// ── Address Input with Autocomplete ──────────────────────────────────────────

interface AddressInputProps {
  value: string
  onChange: (val: string) => void
  onSelect: (suggestion: Suggestion) => void
  placeholder: string
  icon: string
  inputStyle: React.CSSProperties
}

function AddressInput({ value, onChange, onSelect, placeholder, icon, inputStyle }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (q: string) => {
    const results = await getSuggestions(q)
    setSuggestions(results)
    setShowDropdown(results.length > 0)
    setActiveIdx(-1)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) {
      debounceRef.current = setTimeout(() => {
        setSuggestions([])
        setShowDropdown(false)
      }, 0)
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, fetchSuggestions])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]) }
    if (e.key === 'Escape') setShowDropdown(false)
  }

  function handleSelect(s: Suggestion) {
    onChange(s.name + (s.place_formatted ? `, ${s.place_formatted}` : ''))
    setSuggestions([])
    setShowDropdown(false)
    onSelect(s)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none', zIndex: 1 }}>{icon}</span>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        style={inputStyle}
        autoComplete="off"
      />
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, overflow: 'hidden', zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s.mapbox_id}
              onMouseDown={() => handleSelect(s)}
              style={{
                padding: '10px 16px',
                background: i === activeIdx ? 'rgba(234,40,4,0.15)' : 'transparent',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                {s.name}
              </div>
              {s.place_formatted && (
                <div style={{ fontSize: 10, color: '#646464', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                  {s.place_formatted}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TripPlanner({ sac }: { sac: CityScore | null }) {
  const [origin, setOrigin] = useState('')
  const [dest, setDest]     = useState('')
  const [originId, setOriginId] = useState<string | null>(null)
  const [destId, setDestId]     = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')
  const [result, setResult]     = useState<RouteResult | null>(null)
  const [cols, setCols]         = useState('1fr 1fr')
  const mobile = cols === '1fr'

  useEffect(() => {
    const check = () => setCols(window.innerWidth < 900 ? '1fr' : '1fr 1fr')
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const pain       = result?.pain_factor     ?? sac?.pain_factor    ?? 4.6
  const transitMin = result?.transit_minutes ?? sac?.transit_minutes ?? 100
  const driveMin   = result?.drive_minutes   ?? sac?.drive_minutes   ?? 15
  const waitMin    = result?.wait_minutes    ?? sac?.wait_minutes    ?? 41
  const waitPct    = result?.wait_pct        ?? sac?.wait_pct        ?? 41

  async function calculate() {
    if (!origin.trim() || !dest.trim()) { setError('Enter both addresses.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    setDone(false)

    try {
      // Get coordinates — use selected mapbox_id if available, else fall back to geocode
      let originCoord: { lat: number; lon: number } | null = null
      let destCoord:   { lat: number; lon: number } | null = null

      if (originId) {
        originCoord = await retrieveCoords(originId)
      } else {
        // Fallback geocode for manual text entry
        const q = origin.includes('Sacramento') || origin.includes('CA') ? origin : `${origin}, Sacramento CA`
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=US&proximity=-121.4944,38.5816`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.features?.length) {
            const [lon, lat] = data.features[0].center
            originCoord = { lat, lon }
          }
        }
      }

      if (destId) {
        destCoord = await retrieveCoords(destId)
      } else {
        const q = dest.includes('Sacramento') || dest.includes('CA') ? dest : `${dest}, Sacramento CA`
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=US&proximity=-121.4944,38.5816`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.features?.length) {
            const [lon, lat] = data.features[0].center
            destCoord = { lat, lon }
          }
        }
      }

      if (!originCoord) { setError('Could not find origin — try selecting from the dropdown.'); setLoading(false); return }
      if (!destCoord)   { setError('Could not find destination — try selecting from the dropdown.'); setLoading(false); return }

      const res = await fetch('/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: originCoord.lat,
          originLon: originCoord.lon,
          destLat:   destCoord.lat,
          destLon:   destCoord.lon,
          cityId:    'sacramento',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.hint || data.error || 'No route found — try addresses closer to a bus stop.')
        setDone(false)
        setLoading(false)
        return
      }

      setResult(data)
      setDone(true)

    } catch {
      setError('Routing failed — please try again.')
    }

    setLoading(false)
  }

  function shareOnX() {
    const text = result
      ? `My Sacramento commute:\n\n🚍 ${fmtMin(transitMin)} by transit\n🚗 ${fmtMin(driveMin)} by car\n\n${pain}× slower — and we're the state capital.\n\nfixsactransit.org`
      : `Sacramento transit is ${pain}× slower than driving. We're the state capital. This should not be acceptable.\n\nfixsactransit.org`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 9999, color: '#fff', fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13, padding: '12px 20px 12px 42px', outline: 'none',
  }

  const originDisplay = origin || ''
  const destDisplay   = dest || ''

  return (
    <section id="trip-planner" style={{ background: '#202020', padding: mobile ? '60px 20px' : '80px 32px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 32 : 48,
        alignItems: 'start',
      }}>

        {/* Form */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            Calculate your pain ratio
          </div>
          <h2 style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: mobile ? 40 : 'clamp(40px, 6vw, 64px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff', marginBottom: 36, textTransform: 'uppercase' }}>
            YOUR<br /><span style={{ color: '#ea2804' }}>COMMUTE</span>
          </h2>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', display: 'block', marginBottom: 5, fontFamily: 'JetBrains Mono, monospace' }}>From</label>
            <AddressInput
              value={originDisplay}
              onChange={v => { setOrigin(v); setOriginId(null) }}
              onSelect={s => { setOriginId(s.mapbox_id) }}
              placeholder="Start typing your address..."
              icon="📍"
              inputStyle={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            <button
              onClick={() => {
                const tmp = origin; setOrigin(dest); setDest(tmp)
                const tmpId = originId; setOriginId(destId); setDestId(tmpId)
              }}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9999, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 13 }}
            >⇅</button>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', display: 'block', marginBottom: 5, fontFamily: 'JetBrains Mono, monospace' }}>To</label>
            <AddressInput
              value={destDisplay}
              onChange={v => { setDest(v); setDestId(null) }}
              onSelect={s => { setDestId(s.mapbox_id) }}
              placeholder="Start typing your destination..."
              icon="🏁"
              inputStyle={inputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: '#ea2804', marginBottom: 10, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <button
            onClick={calculate}
            disabled={loading}
            style={{ width: '100%', background: loading ? 'rgba(234,40,4,0.5)' : '#ea2804', color: '#fff', border: 'none', borderRadius: 9999, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Routing...' : 'Calculate Pain Ratio'}
          </button>

          {result && (
            <div style={{ marginTop: 16, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>
              <span style={{ color: '#8d8d8d' }}>Nearest stops:</span><br />
              📍 {result.origin_stop}<br />
              🏁 {result.dest_stop}
            </div>
          )}
        </div>

        {/* Result card */}
        <div style={{ opacity: done ? 1 : 0.25, transition: 'opacity 0.4s', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#646464', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
              {origin ? `${origin.split(',')[0]} → ${dest.split(',')[0]}` : 'Your trip'}
            </span>
            <div style={{ background: result ? '#2b9a66' : '#ea2804', color: '#fff', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 9999, flexShrink: 0 }}>
              {result ? 'Routed' : 'Live'}
            </div>
          </div>

          <div style={{ padding: '24px 24px 8px' }}>
            <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 88, fontWeight: 900, lineHeight: 0.85, color: '#ea2804' }}>{pain}×</div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#646464', textTransform: 'uppercase', marginTop: 10, fontFamily: 'JetBrains Mono, monospace' }}>Times slower than driving</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '14px 24px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#646464', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>By Transit</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontWeight: 900, fontSize: 30, color: '#ea2804' }}>{fmtMin(transitMin)}</div>
            </div>
            <div style={{ padding: '14px 24px' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#646464', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>By Car</div>
              <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontWeight: 900, fontSize: 30, color: '#fff' }}>{fmtMin(driveMin)}</div>
            </div>
          </div>

          <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, marginBottom: 8 }}>
              <div style={{ height: '100%', background: '#ea2804', borderRadius: 9999, width: done ? `${waitPct}%` : '0%', transition: 'width 1.5s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
            <div style={{ fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: '#ea2804', fontWeight: 600 }}>{waitPct}%</span> of this trip is waiting — {waitMin} min standing still.
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 24px' }}>
            {result ? (
              [
                { icon: '🚶', label: `Walk to ${result.origin_stop}`, type: 'walk', dur: result.walk_minutes },
                { icon: '⏸',  label: 'Wait for bus', type: 'wait', dur: result.wait_minutes },
                { icon: '🚍', label: `Bus to ${result.dest_stop}`, type: 'bus', dur: Math.max(1, result.transit_minutes - result.walk_minutes - result.wait_minutes) },
              ].map((s, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 11, color: s.type === 'wait' ? '#ea2804' : '#8d8d8d', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ width: 18, textAlign: 'center' }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: '#4e4e4e' }}>{s.dur}m</span>
                </div>
              ))
            ) : (
              [
                { icon: '🚶', label: 'Walk to nearest stop', type: 'walk' },
                { icon: '⏸',  label: 'Wait for bus', type: 'wait' },
                { icon: '🚍', label: 'Transit to destination', type: 'bus' },
              ].map((s, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 11, color: s.type === 'wait' ? '#ea2804' : '#8d8d8d', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ width: 18, textAlign: 'center' }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: '#4e4e4e' }}>—</span>
                </div>
              ))
            )}
          </div>

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
