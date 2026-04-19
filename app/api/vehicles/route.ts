// app/api/vehicles/route.ts
import { NextResponse } from 'next/server'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
const { FeedMessage } = GtfsRealtimeBindings.transit_realtime

const SACRT_VEHICLES_URL = 'https://bustime.sacrt.com/gtfsrt/vehicles'

export async function GET() {
  try {
    const res = await fetch(SACRT_VEHICLES_URL, {
      headers: { 'User-Agent': 'fixsactransit.org/1.0' },
      next: { revalidate: 15 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Feed returned ${res.status}` }, { status: 502 })
    }

    const buffer = await res.arrayBuffer()
    const feed = FeedMessage.decode(new Uint8Array(buffer))

    const vehicles = feed.entity
      .filter(e => e.vehicle?.position)
      .map(e => ({
        id: e.id,
        route_id: e.vehicle?.trip?.routeId ?? '',
        trip_id: e.vehicle?.trip?.tripId ?? '',
        vehicle_id: e.vehicle?.vehicle?.id ?? '',
        vehicle_label: e.vehicle?.vehicle?.label ?? '',
        latitude: e.vehicle!.position!.latitude,
        longitude: e.vehicle!.position!.longitude,
        bearing: e.vehicle?.position?.bearing ?? 0,
        speed: e.vehicle?.position?.speed ?? 0,
        timestamp: Number(e.vehicle?.timestamp ?? 0),
      }))

    return NextResponse.json(
      { vehicles, fetched_at: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' } }
    )
  } catch (err) {
    console.error('vehicles route error:', err)
    return NextResponse.json({ error: 'Failed to fetch vehicle feed' }, { status: 500 })
  }
}
