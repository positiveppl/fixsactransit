// @ts-nocheck
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window { mapboxgl: any }
}

const BLUE_LINE_COORDS: [number, number][] = [
  [-121.383135, 38.645083], [-121.394656, 38.642792], [-121.402497, 38.638219],
  [-121.425051, 38.621427], [-121.439696, 38.607683], [-121.446798, 38.606416],
  [-121.456956, 38.606167], [-121.466190, 38.602765], [-121.488042, 38.585978],
  [-121.490258, 38.580802], [-121.492022, 38.578695], [-121.496721, 38.579892],
  [-121.498746, 38.578277], [-121.499864, 38.575831], [-121.494532, 38.574428],
  [-121.493370, 38.571041], [-121.489352, 38.569871], [-121.487925, 38.559808],
  [-121.488174, 38.551645], [-121.485398, 38.542198], [-121.479995, 38.525205],
  [-121.475956, 38.512133], [-121.471624, 38.497634], [-121.467137, 38.483255],
  [-121.463084, 38.465695], [-121.447837, 38.462660], [-121.428947, 38.458469],
  [-121.418192, 38.452777],
]

const GOLD_LINE_COORDS: [number, number][] = [
  [-121.499690, 38.584844], [-121.496934, 38.582566], [-121.497882, 38.580205],
  [-121.496721, 38.579892], [-121.498746, 38.578277], [-121.499864, 38.575831],
  [-121.494532, 38.574428], [-121.493370, 38.571041], [-121.489352, 38.569871],
  [-121.479092, 38.566641], [-121.471335, 38.564560], [-121.457756, 38.560658],
  [-121.448619, 38.558239], [-121.435863, 38.554803], [-121.427306, 38.552612],
  [-121.407499, 38.547350], [-121.393058, 38.547044], [-121.373319, 38.553826],
  [-121.362311, 38.559352], [-121.353046, 38.564059], [-121.346181, 38.567306],
  [-121.311137, 38.584794], [-121.290457, 38.594810], [-121.283142, 38.598441],
  [-121.267599, 38.605999], [-121.212479, 38.630198], [-121.190422, 38.644296],
  [-121.183663, 38.663372], [-121.180485, 38.676482],
]

const GREEN_LINE_COORDS: [number, number][] = [
  [-121.492355, 38.596501], [-121.496934, 38.582566], [-121.497882, 38.580205],
  [-121.496721, 38.579892], [-121.498746, 38.578277], [-121.499864, 38.575831],
  [-121.494532, 38.574428], [-121.493370, 38.571041],
]

const N_TRAINS_PER_LINE = 4

interface SimTrain {
  id: string
  line: 'gold' | 'blue'
  t: number
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

function vehiclesToGeoJSON(vehicles: BusVehicle[]) {
  return {
    type: 'FeatureCollection' as const,
    features: vehicles.map(v => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [v.longitude, v.latitude] },
      properties: {
        id: v.id,
        route_id: v.route_id || '',
        vehicle_label: v.vehicle_label || v.id,
        speed_mph: v.speed ? Math.round(v.speed * 2.237) : 0,
      },
    })),
  }
}

function trainStateToGeoJSON(trains: SimTrain[]) {
  return {
    type: 'FeatureCollection' as const,
    features: trains.map(train => {
      const coords = train.line === 'gold' ? GOLD_LINE_COORDS : BLUE_LINE_COORDS
      const [lng, lat] = coordAtT(coords, train.t)
      return {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [lng, lat] },
        properties: { id: train.id, color: train.color },
      }
    }),
  }
}

export default function TransitMapbox({ mapboxToken }: { mapboxToken: string }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const animFrameRef = useRef<number>(0)
  const trainStateRef = useRef<SimTrain[]>([])
  const popupRef = useRef<any>(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [busCount, setBusCount] = useState(0)
  const [lastFetch, setLastFetch] = useState<string>('')
  const [fetchError, setFetchError] = useState(false)

  function initTrains(): SimTrain[] {
    const trains: SimTrain[] = []
    ;([
      { key: 'gold' as const, color: '#F9A61A' },
      { key: 'blue' as const, color: '#2563EB' },
    ]).forEach(({ key, color }) => {
      for (let i = 0; i < N_TRAINS_PER_LINE; i++) {
        trains.push({ id: `${key}-${i}`, line: key, t: i / N_TRAINS_PER_LINE, dir: i % 2 === 0 ? 1 : -1, color })
      }
    })
    return trains
  }

  const fetchBuses = useCallback(async () => {
    try {
      const res = await fetch('https://vehicles.msgpnn.workers.dev', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      const vehicles: BusVehicle[] = (data.vehicles || []).filter(
        (v: BusVehicle) => v.latitude && v.longitude && Math.abs(v.latitude) > 1
      )
      setBusCount(vehicles.length)
      setLastFetch(new Date().toLocaleTimeString())
      setFetchError(false)
      return vehicles
    } catch {
      setFetchError(true)
      return []
    }
  }, [])

  function animateTrains(map: any) {
    const SPEED = 0.00012
    function frame() {
      trainStateRef.current.forEach(train => {
        train.t += SPEED * train.dir
        if (train.t >= 1) { train.t = 1; train.dir = -1 }
        if (train.t <= 0) { train.t = 0; train.dir = 1 }
      })
      const src = map.getSource('trains')
      if (src) src.setData(trainStateToGeoJSON(trainStateRef.current))

      const t = Date.now() / 1000
      if (map.getLayer('gold-line')) map.setPaintProperty('gold-line', 'line-opacity', 0.4 + Math.sin(t * 1.2) * 0.15)
      if (map.getLayer('blue-line')) map.setPaintProperty('blue-line', 'line-opacity', 0.4 + Math.sin(t * 1.5 + 1) * 0.15)

      animFrameRef.current = requestAnimationFrame(frame)
    }
    frame()
  }

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapRef.current) return

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
        center: [-121.4944, 38.5816],
        zoom: 12.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

      map.on('load', () => {

        // ── Rail lines ────────────────────────────────────────────────
        const addLine = (id: string, coords: [number, number][], color: string, dash: number[], opacity: number) => {
          map.addSource(`${id}-src`, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} } })
          map.addLayer({ id: `${id}-bg`, type: 'line', source: `${id}-src`, paint: { 'line-color': color, 'line-width': 2, 'line-opacity': 0.12 } })
          map.addLayer({ id, type: 'line', source: `${id}-src`, paint: { 'line-color': color, 'line-width': 2, 'line-dasharray': dash, 'line-opacity': opacity } })
        }
        addLine('gold-line', GOLD_LINE_COORDS, '#F9A61A', [4, 4], 0.4)
        addLine('blue-line', BLUE_LINE_COORDS, '#2563EB', [4, 4], 0.4)
        addLine('green-line', GREEN_LINE_COORDS, '#16a34a', [2, 6], 0.25)

        // ── Train circles (GPU layer — never floats) ──────────────────
        trainStateRef.current = initTrains()
        map.addSource('trains', { type: 'geojson', data: trainStateToGeoJSON(trainStateRef.current) })
        map.addLayer({
          id: 'trains-layer',
          type: 'circle',
          source: 'trains',
          paint: {
            'circle-radius': 5,
            'circle-color': 'transparent',
            'circle-stroke-width': 2,
            'circle-stroke-color': ['get', 'color'],
          },
        })

        // ── Bus circles (GPU layer — never floats) ────────────────────
        map.addSource('buses', { type: 'geojson', data: vehiclesToGeoJSON([]) })

        // White halo
        map.addLayer({
          id: 'buses-halo',
          type: 'circle',
          source: 'buses',
          paint: { 'circle-radius': 9, 'circle-color': '#ffffff', 'circle-opacity': 0.95 },
        })

        // Red dot
        map.addLayer({
          id: 'buses-layer',
          type: 'circle',
          source: 'buses',
          paint: {
            'circle-radius': 6,
            'circle-color': '#ea2804',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
          },
        })

        // Route number label
        map.addLayer({
          id: 'buses-label',
          type: 'symbol',
          source: 'buses',
          layout: {
            'text-field': ['slice', ['get', 'route_id'], 0, 3],
            'text-size': 7,
            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
          },
          paint: { 'text-color': '#ffffff' },
        })

        // ── Popups ────────────────────────────────────────────────────
        const showPopup = (lngLat: any, html: string) => {
          popupRef.current?.remove()
          popupRef.current = new mapboxgl.Popup({ offset: 12, closeButton: false, className: 'transit-popup' })
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(map)
        }

        map.on('click', 'buses-layer', (e: any) => {
          const p = e.features[0].properties
          showPopup(e.features[0].geometry.coordinates, `
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.6;padding:6px 10px">
              <strong style="color:#ea2804">Route ${p.route_id || '—'}</strong><br/>
              Vehicle ${p.vehicle_label}<br/>
              ${p.speed_mph > 0 ? `${p.speed_mph} mph` : 'Stationary'}
            </div>
          `)
        })

        map.on('click', 'trains-layer', (e: any) => {
          const p = e.features[0].properties
          const name = p.id.startsWith('gold') ? 'Gold Line' : 'Blue Line'
          showPopup(e.features[0].geometry.coordinates, `
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;padding:6px 10px;line-height:1.5">
              <strong style="color:${p.color}">${name}</strong><br/>
              <span style="color:#8d8d8d">Simulated — no real-time feed</span>
            </div>
          `)
        })

        map.on('mouseenter', 'buses-layer', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'buses-layer', () => { map.getCanvas().style.cursor = '' })
        map.on('mouseenter', 'trains-layer', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'trains-layer', () => { map.getCanvas().style.cursor = '' })

        // ── Kick off ──────────────────────────────────────────────────
        animateTrains(map)

        fetchBuses().then(vehicles => {
          if (vehicles.length > 0) {
            map.getSource('buses')?.setData(vehiclesToGeoJSON(vehicles))
          }
        })

        setMapLoaded(true)
      })
    }
    document.head.appendChild(script)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      popupRef.current?.remove()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [mapboxToken])

  useEffect(() => {
    if (!mapLoaded) return
    const interval = setInterval(async () => {
      const vehicles = await fetchBuses()
      if (mapRef.current && vehicles.length > 0) {
        mapRef.current.getSource('buses')?.setData(vehiclesToGeoJSON(vehicles))
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [mapLoaded, fetchBuses])

  return (
    <div style={{ border: '1px solid #202020', borderRadius: 24, overflow: 'hidden', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e5e5e5' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#202020', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
          sacrt_live_map.js
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {!fetchError ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, background: '#2b9a66', color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              <div className="pulse" style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%' }} />
              {busCount > 0 ? `${busCount} buses live` : 'Connecting...'}
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, border: '1px solid #ea2804', color: '#ea2804', fontFamily: 'JetBrains Mono, monospace' }}>
              Feed error — retrying
            </div>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 9999, border: '1px solid #bbbbbb', color: '#bbbbbb', fontFamily: 'JetBrains Mono, monospace' }}>
            Rail: no feed
          </div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div ref={mapContainer} style={{ width: '100%', height: 420 }} />
        {!mapLoaded && (
          <div style={{ position: 'absolute', inset: 0, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d', letterSpacing: '0.08em' }}>
              Loading map...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, padding: '10px 20px', flexWrap: 'wrap' }}>
        {[
          { color: '#ea2804', label: 'Bus (GPS — live)', dot: true },
          { color: '#F9A61A', label: 'Gold Line (schedule est.)', dot: false },
          { color: '#2563EB', label: 'Blue Line (schedule est.)', dot: false },
          { color: '#16a34a', label: 'Green Line (suspended Jun 2025)', dot: false },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#646464', fontFamily: 'JetBrains Mono, monospace' }}>
            {l.dot
              ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0, boxShadow: `0 0 4px ${l.color}66` }} />
              : <div style={{ width: 20, height: 0, borderTop: `2px dashed ${l.color}`, flexShrink: 0, opacity: 0.7 }} />
            }
            {l.label}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d' }}>
          {busCount > 0 ? `${busCount} buses tracked · ${trainStateRef.current.length} rail (simulated)` : 'Connecting to SacRT feed...'}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8d8d8d' }}>
          {lastFetch ? `Updated ${lastFetch}` : 'Updates every 15s'}
        </span>
      </div>

      <style>{`
        .transit-popup .mapboxgl-popup-content {
          padding: 0 !important; border-radius: 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          border: 1px solid #e5e5e5 !important; overflow: hidden;
        }
        .transit-popup .mapboxgl-popup-tip { display: none; }
        .mapboxgl-ctrl-bottom-right { bottom: 8px !important; right: 8px !important; }
        .mapboxgl-ctrl-group { border-radius: 8px !important; border: 1px solid #e5e5e5 !important; box-shadow: none !important; }
      `}</style>
    </div>
  )
}
