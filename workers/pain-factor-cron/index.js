// workers/pain-factor-cron/index.js
// ── Runs every 6 hours ────────────────────────────────────────────────────────
// Calls Mapbox Directions API for each city's standard trip,
// computes transit vs drive pain factor, writes to KV.

import { CITIES, BOUNDS, normalize, computeScore } from "../../shared/cities.js";

export default {
  async scheduled(event, env, ctx) {
    console.log("pain-factor-cron: starting", new Date().toISOString());

    if (!env.MAPBOX_TOKEN) {
      console.error("MAPBOX_TOKEN not set — run: wrangler secret put MAPBOX_TOKEN");
      return;
    }

    const results = [];

    for (const city of CITIES) {
      try {
        const pain = await computePainFactor(city, env.MAPBOX_TOKEN);

        // Read existing GTFS scores from KV to merge
        const existing = await env.TRANSIT_KV.get(`city:${city.id}`, "json") || {};

        const record = {
          ...existing,
          id: city.id,
          name: city.name,
          state: city.state,
          rail_feed: city.rail_feed,
          pain_factor: pain.ratio,
          transit_minutes: pain.transit_minutes,
          drive_minutes: pain.drive_minutes,
          pain_score: normalize(pain.ratio, BOUNDS.pain, "lower_better"),
          pain_computed_at: new Date().toISOString(),
        };

        // Recompute overall score if we have GTFS data
        if (existing.avg_headway_minutes && existing.coverage_pct) {
          record.score = computeScore(
            existing.avg_headway_minutes,
            existing.coverage_pct,
            pain.ratio,
          );
        }

        await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
        results.push({ city: city.id, status: "ok", ...pain });

        // Respect Mapbox rate limits — 10 req/sec max
        await sleep(150);

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: "error", error: err.message });
      }
    }

    await env.TRANSIT_KV.put("pain:last_run", JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log("pain-factor-cron: done", results);
  },

  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      await this.scheduled({}, env, {});
      return new Response("Done", { status: 200 });
    }
    return new Response("pain-factor-cron worker", { status: 200 });
  },
};

// ── Pain Factor Calculation ───────────────────────────────────────────────────

async function computePainFactor(city, mapboxToken) {
  const { origin, destination } = city.trip;

  // Fetch both transit and driving routes in parallel
  const [transitRes, drivingRes] = await Promise.all([
    fetchMapboxDirections(origin, destination, "driving-traffic", mapboxToken),
    fetchMapboxDirections(origin, destination, "driving-traffic",  mapboxToken),
    // Note: Mapbox transit profile requires Mapbox Transit API (separate product)
    // For MVP, use Google Maps or fall back to GTFS-based estimation
    // See HANDOFF.md for upgrading to real transit routing
  ]);

  // Mapbox doesn't have a public transit profile in the standard Directions API
  // Use the driving time as baseline, apply city-specific transit multiplier
  // from GTFS frequency data until we integrate a full transit router
  const driveSeconds = drivingRes.routes?.[0]?.duration || 900;
  const driveMinutes = Math.round(driveSeconds / 60);

  // Transit estimate: drive_time * estimated_multiplier based on city
  // This gets replaced by real GTFS routing in Step 2
  const transitMinutes = await estimateTransitTime(city, driveMinutes);

  const ratio = Math.round((transitMinutes / driveMinutes) * 10) / 10;

  return {
    transit_minutes: transitMinutes,
    drive_minutes: driveMinutes,
    ratio,
  };
}

async function fetchMapboxDirections(origin, destination, profile, token) {
  const [oLat, oLon] = origin.split(",");
  const [dLat, dLon] = destination.split(",");

  // Mapbox expects lon,lat order
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${oLon},${oLat};${dLon},${dLat}?access_token=${token}&overview=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox error: ${res.status}`);
  return res.json();
}

// Estimate transit time from GTFS frequency data
// Real transit routing (OpenTripPlanner) is Step 3 of the pipeline
// For now: apply realistic multipliers based on known system quality
async function estimateTransitTime(city, driveMinutes) {
  // Fallback multipliers based on known system quality
  // These get overridden once we have real GTFS routing
  const KNOWN_MULTIPLIERS = {
    new_york:      1.4,  // Subway is genuinely fast
    chicago:       1.8,  // Good but not NYC
    washington_dc: 1.6,  // Metro is solid
    san_francisco: 2.1,  // MUNI is slow, BART is fast — average
    seattle:       2.3,  // Light rail good, buses slow
    los_angeles:   2.8,  // Improving but still car city
    portland:      2.0,  // TriMet punches above weight
    denver:        2.5,  // RTD decent for size
    minneapolis:   2.6,  // Good for a cold city
    phoenix:       3.8,  // Car dependent
    san_jose:      3.5,  // VTA is notoriously bad
    sacramento:    6.6,  // The whole point of this project
  };

  const multiplier = KNOWN_MULTIPLIERS[city.id] || 3.0;
  return Math.round(driveMinutes * multiplier);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
