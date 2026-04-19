// workers/vehicles/index.js
// SacRT GTFS-RT Vehicle Positions Worker (PRODUCTION SAFE)

import { transit_realtime } from "gtfs-realtime-bindings";

const SACRT_VEHICLES_URL = "https://bustime.sacrt.com/gtfsrt/vehicles";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      // Fetch GTFS-RT feed
      const res = await fetch(SACRT_VEHICLES_URL, {
        headers: {
          "User-Agent": "fixsactransit/1.0",
          "Accept": "*/*",
        },
        cf: {
          cacheTtl: 0, // IMPORTANT: disable edge caching
        },
      });

      if (!res.ok) {
        return json(
          { error: `GTFS feed returned ${res.status}` },
          502
        );
      }

      const buffer = await res.arrayBuffer();

      // Decode protobuf safely
      const feed = transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      );

      // Extract vehicles
      const vehicles = (feed.entity || [])
        .filter((e) => e.vehicle && e.vehicle.position)
        .map((e) => ({
          id: e.id,
          route_id: e.vehicle.trip?.routeId || "",
          trip_id: e.vehicle.trip?.tripId || "",
          vehicle_id: e.vehicle.vehicle?.id || "",
          label: e.vehicle.vehicle?.label || "",
          latitude: e.vehicle.position.latitude,
          longitude: e.vehicle.position.longitude,
          bearing: e.vehicle.position.bearing || 0,
          speed: e.vehicle.position.speed || 0,
          timestamp: e.vehicle.timestamp || 0,
        }));

      return json({
        vehicles,
        count: vehicles.length,
        fetched_at: new Date().toISOString(),
      });
    } catch (err) {
      return json(
        {
          error: "Failed to process GTFS feed",
          detail: err.message,
        },
        500
      );
    }
  },
};

// Helper: JSON response with proper headers
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // CRITICAL for live GPS
    },
  });
}