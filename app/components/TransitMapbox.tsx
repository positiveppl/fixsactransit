'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'

declare global {
  interface Window { mapboxgl: typeof mapboxgl }
}

// ── Sacramento light rail shapes (from actual GTFS shapes.txt) ─────────────────
// Gold Line: Watt/I-80 ↔ Meadowview (east-west trunk + south branch)
// Blue Line: Sacramento Valley Station ↔ Cosumnes River College (diagonal NW→SE)
// Coordinates are the real alignment, simplified to key waypoints

const BLUE_LINE_COORDS: [number, number][] = [
  [-121.383135, 38.645083], // Watt/I-80
  [-121.394656, 38.642792], // Watt/I-80 West
  [-121.402497, 38.638219], // Roseville Road
  [-121.425051, 38.621427], // Marconi/Arcade
  [-121.439696, 38.607683], // Swanston
  [-121.446798, 38.606416], // Royal Oaks
  [-121.456956, 38.606167], // Arden/Del Paso
  [-121.466190, 38.602765], // Globe Avenue
  [-121.488042, 38.585978], // Alkali Flat/La Valentina
  [-121.490258, 38.580802], // 12th & I
  [-121.492022, 38.578695], // Cathedral Square
  [-121.496721, 38.579892], // 8th & K
  [-121.498746, 38.578277], // 7th & Capitol
  [-121.499864, 38.575831], // 8th & O
  [-121.494532, 38.574428], // Archives Plaza
  [-121.493370, 38.571041], // 13th Street
  [-121.489352, 38.569871], // 16th Street
  [-121.487925, 38.559808], // Broadway
  [-121.488174, 38.551645], // 4th Ave/Wayne Hultgren
  [-121.485398, 38.542198], // City College
  [-121.479995, 38.525205], // Fruitridge
  [-121.475956, 38.512133], // 47th Avenue
  [-121.471624, 38.497634], // Florin
  [-121.467137, 38.483255], // Meadowview
  [-121.463084, 38.465695], // Morrison Creek
  [-121.447837, 38.462660], // Franklin
  [-121.428947, 38.458469], // Center Parkway
  [-121.418192, 38.452777], // Cosumnes River College
]

const GOLD_LINE_COORDS: [number, number][] = [
  [-121.499690, 38.584844], // Sacramento Valley Station
  [-121.496934, 38.582566], // 7th & I / County Center
  [-121.497882, 38.580205], // 7th & K
  [-121.496721, 38.579892], // 8th & K
  [-121.498746, 38.578277], // 7th & Capitol
  [-121.499864, 38.575831], // 8th & O
  [-121.494532, 38.574428], // Archives Plaza
  [-121.493370, 38.571041], // 13th Street
  [-121.489352, 38.569871], // 16th Street
  [-121.479092, 38.566641], // 23rd Street
  [-121.471335, 38.564560], // 29th Street
  [-121.457756, 38.560658], // 39th Street
  [-121.448619, 38.558239], // 48th Street
  [-121.435863, 38.554803], // 59th Street
  [-121.427306, 38.552612], // University/65th Street
  [-121.407499, 38.547350], // Power Inn
  [-121.393058, 38.547044], // College Greens
  [-121.373319, 38.553826], // Watt/Manlove
  [-121.362311, 38.559352], // Starfire
  [-121.353046, 38.564059], // Tiber
  [-121.346181, 38.567306], // Butterfield
  [-121.311137, 38.584794], // Mather Field/Mills
  [-121.290457, 38.594810], // Zinfandel
  [-121.283142, 38.598441], // Cordova Town Center
  [-121.267599, 38.605999], // Sunrise
  [-121.212479, 38.630198], // Hazel
  [-121.190422, 38.644296], // Iron Point
  [-121.183663, 38.663372], // Glenn
  [-121.180485, 38.676482], // Historic Folsom
]

const GREEN_LINE_COORDS: [number, number][] = [
  [-121.492355, 38.596501], // 7th & Richards / Township 9
  [-121.496934, 38.582566], // 7th & I / County Center
  [-121.497882, 38.580205], // 7th & K
  [-121.496721, 38.579892], // 8th & K
  [-121.498746, 38.578277], // 7th & Capitol
  [-121.499864, 38.575831], // 8th & O
  [-121.494532, 38.574428], // Archives Plaza
  [-121.493370, 38.571041], // 13th Street
]

// Headway for simulated trains (minutes between trains per direction)
const TRAIN_HEADWAY_MIN = 15
const N_TRAINS_PER_LINE = 4

interface SimTrain {
  id: string
  line: 'gold' | 'blue'
  t: number   // 0–1 position along the line
  dir: 1 | -1
  color: string
}

interface BusVehicle {
  id: string
  route_id: string
  vehicle_label: string
  latitude: number
  longitude: number
  bearing: number
  speed: number
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function coordAtT(coords: [number, number][], t: number): [number, number] {
  if (t <= 0) return coords[0]
  if (t >= 1) return coords[coords.length - 1]
  const idx = t * (coords.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.min(lo + 1, coords.length - 1)
  const f = idx - lo
  return [lerp(coords[lo][0], coords[hi][0], f), lerp(coords[lo][1], coords[hi][1], f)]
}

function bearingAtT(coords: [number, number][], t: number): number {
  const eps = 0.01
  const a = coordAtT(coords, Math.max(0, t - eps))
  const b = coordAtT(coords, Math.min(1, t + eps))
  const dx = b[0] - a[0], dy = b[1] - a[1]
  return (Math.atan2(dx, dy) * 180) / Math.PI
}

export default function TransitMapbox({ mapboxToken }: { mapboxToken: string }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const trainMarkersRef = useRef<mapboxgl.Marker[]>([])
  const animFrameRef = useRef<number>(0)
  const trainStateRef = useRef<SimTrain[]>([])
  const busDataRef = useRef<BusVehicle[]>([])
  const countRef = useRef<HTMLSpanElement>(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [busCount, setBusCount] = useState(0)
  const [lastFetch, setLastFetch] = useState<string>('')
  const [fetchError, setFetchError] = useState(false)

  // Init simulated trains — stagger their starting positions evenly
  function initTrains(): SimTrain[] {
    const trains: SimTrain[] = []
    const lines: Array<{ key: 'gold' | 'blue'; color: string }> = [
      { key: 'gold', color: '#F9A61A' },
      { key: 'blue', color: '#2563EB' },
    ]
    lines.forEach(({ key, color }) => {
      for (let i = 0; i < N_TRAINS_PER_LINE; i++) {
        trains.push({
          id: `${key}-${i}`,
          line: key,
          t: i / N_TRAINS_PER_LINE,
          dir: i % 2 === 0 ? 1 : -1,
          color,
        })
      }
    })
    return trains
  }

  // Fetch real bus positions from our API route
  const fetchBuses = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      const vehicles: BusVehicle[] = (data.vehicles || []).filter(
        (v: BusVehicle) => v.latitude && v.longitude && Math.abs(v.latitude) > 1
      )
      busDataRef.current = vehicles
      setBusCount(vehicles.length)
      setLastFetch(new Date().toLocaleTimeString())
      setFetchError(false)
      return vehicles
    } catch {
      setFetchError(true)
      return []
    }
  }, [])

  // Create or update bus marker DOM element
  function makeBusEl(vehicle: BusVehicle): HTMLElement {
    const el = document.createElement('div')
    el.className = 'transit-bus-marker'
    el.style.cssText = `
      width: 22px; height: 22px;
      background: #ea2804;
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(234,40,4,0.5);
      cursor: pointer;
      transition: transform 0.3s ease;
      position: relative;
    `
    // Route badge
    const badge = document.createElement('span')
    badge.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px; font-weight: 700;
      color: #fff; line-height: 1;
      text-align: center; overflow: hidden;
      max-width: 18px; white-space: nowrap;
    `
    badge.textContent = vehicle.route_id?.slice(0, 3) || '·'
    el.appendChild(badge)

    // Bearing indicator
    if (vehicle.bearing) {
      const arrow = document.createElement('div')
      arrow.style.cssText = `
        position: absolute; top: -8px; left: 50%;
        transform: translateX(-50%) rotate(${vehicle.bearing}deg);
        width: 0; height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 7px solid #ea2804;
      `
      el.appendChild(arrow)
    }
    return el
  }

  function makeTrainEl(color: string): HTMLElement {
    const el = document.createElement('div')
    el.style.cssText = `
      width: 12px; height: 12px;
      background: transparent;
      border: 2px solid ${color};
      border-radius: 50%;
      box-shadow: 0 0 6px ${color}66;
      pointer-events: none;
    `
    return el
  }

  // Update bus markers on the map
  function updateBusMarkers(map: mapboxgl.Map, vehicles: BusVehicle[]) {
    const seen = new Set<string>()

    vehicles.forEach(v => {
      seen.add(v.id)
      const existing = markersRef.current.get(v.id)

      if (existing) {
        // Animate to new position
        existing.setLngLat([v.longitude, v.latitude])
      } else {
        const el = makeBusEl(v)
        const popup = new mapboxgl.Popup({ offset: 14, closeButton: false, className: 'transit-popup' })
          .setHTML(`
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5;padding:4px 8px">
              <strong style="color:#ea2804">Route ${v.route_id || '—'}</strong><br/>
              Vehicle ${v.vehicle_label || v.id}<br/>
              ${v.speed ? `${Math.round(v.speed * 3.6)}km/h` : 'Stationary'}
            </div>
          `)
        const marker = new mapboxgl.Marker({ element: el, rotation: 0 })
          .setLngLat([v.longitude, v.latitude])
          .setPopup(popup)
          .addTo(map)
        markersRef.current.set(v.id, marker)
      }
    })

    // Remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })
  }

  // Animate simulated trains
  function animateTrains(map: mapboxgl.Map) {
    const SPEED = 0.00012 // fraction of line per frame @ 60fps

    function frame() {
      trainStateRef.current.forEach((train, i) => {
        train.t += SPEED * train.dir
        if (train.t >= 1) { train.t = 1; train.dir = -1 }
        if (train.t <= 0) { train.t = 0; train.dir = 1 }

        const coords = train.line === 'gold' ? GOLD_LINE_COORDS : BLUE_LINE_COORDS
        const [lng, lat] = coordAtT(coords, train.t)
        const bearing = bearingAtT(coords, train.t)

        if (trainMarkersRef.current[i]) {
          trainMarkersRef.current[i].setLngLat([lng, lat])
          const el = trainMarkersRef.current[i].getElement() as HTMLElement
          el.style.transform = `rotate(${bearing}deg)`
        }
      })

      // Pulse glow on Gold/Blue line layers
      const t = Date.now() / 1000
      const goldOpacity = 0.4 + Math.sin(t * 1.2) * 0.15
      const blueOpacity = 0.4 + Math.sin(t * 1.5 + 1) * 0.15
      if (map.getLayer('gold-line')) map.setPaintProperty('gold-line', 'line-opacity', goldOpacity)
      if (map.getLayer('blue-line')) map.setPaintProperty('blue-line', 'line-opacity', blueOpacity)

      animFrameRef.current = requestAnimationFrame(frame)
    }
    frame()
  }

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapRef.current) return

    // Dynamically load Mapbox GL JS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js'
    script.onload = () => {
      const mapboxgl = window.mapboxgl
      mapboxgl.accessToken = mapboxToken

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-121.4944, 38.5816], // Downtown Sacramento
        zoom: 12.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      })

      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

      map.on('load', () => {
        // ── Add rail line sources ──────────────────────────────────────
        map.addSource('gold-line-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: GOLD_LINE_COORDS },
            properties: {},
          },
        })

        map.addSource('blue-line-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: BLUE_LINE_COORDS },
            properties: {},
          },
        })

        map.addSource('green-line-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: GREEN_LINE_COORDS },
            properties: {},
          },
        })

        // Gold Line track (dashed — no real-time feed)
        map.addLayer({
          id: 'gold-line-bg',
          type: 'line',
          source: 'gold-line-source',
          paint: {
            'line-color': '#F9A61A',
            'line-width': 2,
            'line-opacity': 0.15,
          },
        })

        map.addLayer({
          id: 'gold-line',
          type: 'line',
          source: 'gold-line-source',
          paint: {
            'line-color': '#F9A61A',
            'line-width': 2,
            'line-dasharray': [4, 4],
            'line-opacity': 0.4,
          },
        })

        // Blue Line track (dashed — no real-time feed)
        map.addLayer({
          id: 'blue-line-bg',
          type: 'line',
          source: 'blue-line-source',
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-opacity': 0.15,
          },
        })

        map.addLayer({
          id: 'blue-line',
          type: 'line',
          source: 'blue-line-source',
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-dasharray': [4, 4],
            'line-opacity': 0.4,
          },
        })

        // Green Line — suspended, so solid dim style (no animated dash)
        map.addLayer({
          id: 'green-line',
          type: 'line',
          source: 'green-line-source',
          paint: {
            'line-color': '#16a34a',
            'line-width': 2,
            'line-opacity': 0.25,
            'line-dasharray': [2, 6], // very sparse dash = suspended feel
          },
        })

        // ── Init simulated trains ──────────────────────────────────────
        trainStateRef.current = initTrains()
        trainStateRef.current.forEach(train => {
          const coords = train.line === 'gold' ? GOLD_LINE_COORDS
                      : train.line === 'blue' ? BLUE_LINE_COORDS
                      : GREEN_LINE_COORDS
          const [lng, lat] = coordAtT(coords, train.t)
          const lineName = train.line === 'gold' ? 'Gold Line'
                        : train.line === 'blue' ? 'Blue Line'
                        : 'Green Line'
          const popup = new mapboxgl.Popup({ offset: 10, closeButton: false })
            .setHTML(`
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;line-height:1.5">
                <strong style="color:${train.color}">${lineName}</strong><br/>
                <span style="color:#8d8d8d">Simulated — no real-time feed</span>
              </div>
            `)
          const marker = new mapboxgl.Marker({ element: makeTrainEl(train.color) })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map)
          trainMarkersRef.current.push(marker)
        })

        // ── Start animation ────────────────────────────────────────────
        animateTrains(map)

        // ── Initial bus fetch ──────────────────────────────────────────
        fetchBuses().then(vehicles => {
          if (vehicles.length > 0) updateBusMarkers(map, vehicles)
        })

        setMapLoaded(true)
      })
    }
    document.head.appendChild(script)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      mapRef.current?.remove()
      mapRef.current = null
      trainMarkersRef.current = []
      markersRef.current.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken])

  // Poll bus positions every 15 seconds
  useEffect(() => {
    if (!mapLoaded) return
    const interval = setInterval(async () => {
      const vehicles = await fetchBuses()
      if (mapRef.current && vehicles.length > 0) {
        updateBusMarkers(mapRef.current, vehicles)
      }
    }, 15000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, fetchBuses])

  return (
    <div style={{ border: '1px solid #202020', borderRadius: 24, overflow: 'hidden', background: '#fff' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #e5e5e5',
      }}>
        <span style={{
          fontSize: 13, fontWeight: 600, color: '#202020',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
        }}>
          sacrt_live_map.js
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {!fetchError ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, padding: '3px 12px',
              borderRadius: 9999, background: '#2b9a66', color: '#fff',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <div className="pulse" style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%' }} />
              {busCount > 0 ? `${busCount} buses live` : 'Connecting...'}
            </div>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, padding: '3px 12px',
              borderRadius: 9999, border: '1px solid #ea2804', color: '#ea2804',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              Feed error — retrying
            </div>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 11, fontWeight: 600, padding: '3px 12px',
            borderRadius: 9999, border: '1px solid #bbbbbb', color: '#bbbbbb',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            Rail: no feed
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative' }}>
        <div ref={mapContainer} style={{ width: '100%', height: 420 }} />

        {/* "No real-time data" watermark — overlaid on map for rail lines */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', textAlign: 'center', zIndex: 2,
          opacity: mapLoaded ? 1 : 0, transition: 'opacity 0.5s',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 8, padding: '5px 12px',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: '0.15em', color: 'rgba(0,0,0,0.2)',
              textTransform: 'uppercase',
            }}>
              Rail position unknown · No public real-time feed
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {!mapLoaded && (
          <div style={{
            position: 'absolute', inset: 0, background: '#fafafa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#8d8d8d', letterSpacing: '0.08em',
            }}>
              Loading map...
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, padding: '10px 20px 10px', flexWrap: 'wrap' }}>
        {[
          { color: '#ea2804', label: 'Bus (GPS — live)', dot: true, border: '2px solid #fff' },
          { color: '#F9A61A', label: 'Gold Line (schedule est.)', dot: false },
          { color: '#2563EB', label: 'Blue Line (schedule est.)', dot: false },
          { color: '#16a34a', label: 'Green Line (suspended Jun 2025)', dot: false, dashed: true, dim: true },
        ].map((l, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace',
          }}>
            {l.dot
              ? <div style={{
                  width: 10, height: 10, borderRadius: '50%', background: l.color,
                  border: l.border || 'none', flexShrink: 0, boxShadow: `0 0 4px ${l.color}66`,
                }} />
              : <div style={{
                  width: 20, height: 0,
                  borderTop: `2px dashed ${l.color}`,
                  flexShrink: 0, opacity: 0.7,
                }} />
            }
            {l.label}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid #e5e5e5',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span ref={countRef} style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d',
        }}>
          {busCount > 0 ? `${busCount} buses tracked · ${trainStateRef.current.length} rail (simulated)` : 'Connecting to SacRT feed...'}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d' }}>
          {lastFetch ? `Updated ${lastFetch}` : 'Updates every 15s'}
        </span>
      </div>

      <style>{`
        .transit-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          border: 1px solid #e5e5e5 !important;
          overflow: hidden;
        }
        .transit-popup .mapboxgl-popup-tip { display: none; }
        .mapboxgl-ctrl-bottom-right { bottom: 8px !important; right: 8px !important; }
        .mapboxgl-ctrl-group { border-radius: 8px !important; border: 1px solid #e5e5e5 !important; box-shadow: none !important; }
      `}</style>
    </div>
  )
}
