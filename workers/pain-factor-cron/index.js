// workers/pain-factor-cron/index.js
// ── Runs every 6 hours ────────────────────────────────────────────────────────
// Uses the in-KV graph + Dijkstra router to compute real transit pain factors.
// Zero cost — no external APIs needed.

import { CITIES, BOUNDS, normalize, computeScore } from '../../shared/cities.js';
import { findRoute } from '../../shared/router.js';
import { patchEdgesWithRealtime } from '../../shared/realtime.js';

const DRIVE_SPEED_KMH = 30;

export default {
  async scheduled(event, env, ctx) {
    console.log('pain-factor-cron: starting', new Date().toISOString());

    const results = [];

    for (const city of CITIES) {
      try {
        console.log(`Routing: ${city.name}`);

        const meta = await env.TRANSIT_KV.get(`meta:${city.id}`, 'json');
        if (!meta) {
          console.warn(`No graph for ${city.id} — run gtfs-score-cron first`);
          results.push({ city: city.id, status: 'no_graph' });
          continue;
        }

        const pain = await computePainFactor(city, env.TRANSIT_KV);
        const existing = await env.TRANSIT_KV.get(`city:${city.id}`, 'json') || {};

        const record = {
          ...existing,
          id:               city.id,
          name:             city.name,
          state:            city.state,
          rail_feed:        city.rail_feed,
          pain_factor:      pain.ratio,
          transit_minutes:  pain.transit_minutes,
          drive_minutes:    pain.drive_minutes,
          walk_minutes:     pain.walk_minutes,
          wait_minutes:     pain.wait_minutes,
          wait_pct:         pain.wait_pct,
          transfers:        pain.transfers,
          route_summary:    pain.route_summary,
          next_departure_min: pain.next_departure_min,
          legs:             pain.legs,
          pain_score:       normalize(pain.ratio, BOUNDS.pain, 'lower_better'),
          pain_computed_at: new Date().toISOString(),
        };

        if (existing.avg_headway_minutes != null && existing.coverage_pct != null) {
          record.score = computeScore(
            existing.avg_headway_minutes,
            existing.coverage_pct,
            pain.ratio,
          );
        }

        await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
        results.push({ city: city.id, status: 'ok', pain_factor: pain.ratio });

        await sleep(300);

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: 'error', error: err.message });
      }
    }

    await env.TRANSIT_KV.put('pain:last_run', JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log('pain-factor-cron: done');
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/run') {
      await this.scheduled({}, env, {});
      return new Response(JSON.stringify({ status: 'done' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname.startsWith('/test/')) {
      const cityId = url.pathname.split('/')[2];
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return new Response('City not found', { status: 404 });

      try {
        const pain = await computePainFactor(city, env.TRANSIT_KV);
        return new Response(JSON.stringify(pain, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({
          error: err.message,
          stack: err.stack,
        }, null, 2), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname === '/debug/sacramento') {
      const meta   = await env.TRANSIT_KV.get('meta:sacramento', 'json');
      const stops  = await env.TRANSIT_KV.get('stops:sacramento', 'json');
      const chunk0 = await env.TRANSIT_KV.get('graph:sacramento:chunk:0', 'json');

      return new Response(JSON.stringify({
        meta,
        stop_count:        stops  ? Object.keys(stops).length  : 0,
        sample_stops:      stops  ? Object.entries(stops).slice(0, 3) : [],
        chunk0_edge_count: chunk0 ? Object.keys(chunk0).length : 0,
        chunk0_sample:     chunk0 ? Object.entries(chunk0).slice(0, 2) : [],
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('pain-factor-cron\n\nEndpoints:\n  /run\n  /test/:cityId\n  /debug/sacramento');
  },
};

// ── Pain Factor Computation ───────────────────────────────────────────────────

async function computePainFactor(city, kv) {
  const [oLat, oLon] = city.trip.origin.split(',').map(Number);
  const [dLat, dLon] = city.trip.destination.split(',').map(Number);

  // 8am Sacramento local time (UTC-7)
  const departureTimeSec = 15 * 3600;

  const itinerary = await findRoute(
    kv,
    city.id,
    { lat: oLat, lon: oLon },
    { lat: dLat, lon: dLon },
    departureTimeSec,
  );

  if (!itinerary) {
    throw new Error(`No route found for ${city.id} — graph may be incomplete`);
  }

  const distKm     = haversineKm(oLat, oLon, dLat, dLon);
  const driveMin   = Math.max(5, Math.round((distKm / DRIVE_SPEED_KMH) * 60));
  const transitMin = itinerary.total_minutes;
  const ratio      = Math.round((transitMin / driveMin) * 10) / 10;

  const nextDepSec = itinerary.next_departure_sec || departureTimeSec;
  const nextDepMin = Math.max(1, Math.round((nextDepSec - departureTimeSec) / 60));

  const routeSummary = itinerary.legs
    .filter(l => l.type === 'bus' || l.type === 'rail')
    .map(l => `${l.type === 'bus' ? 'Bus' : 'Rail'} (${Math.round(l.durationSec / 60)}m)`)
    .join(' → ');

  return {
    transit_minutes:    transitMin,
    drive_minutes:      driveMin,
    walk_minutes:       itinerary.walk_minutes,
    wait_minutes:       itinerary.wait_minutes,
    wait_pct:           itinerary.wait_pct,
    transfers:          itinerary.transfers,
    ratio,
    route_summary:      routeSummary || 'No transit legs found',
    next_departure_min: nextDepMin,
    legs:               itinerary.legs,
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
