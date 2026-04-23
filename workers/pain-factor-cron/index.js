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
    const res = await fetch('https://api-gateway.msgpnn.workers.dev/api/seed/pain', {
      method: 'POST',
    });
    const data = await res.json();
    console.log('pain-factor-cron: done', JSON.stringify(data));
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

const API_GATEWAY = 'https://api-gateway.msgpnn.workers.dev';

async function computePainFactor(city, kv) {
  const [oLat, oLon] = city.trip.origin.split(',').map(Number);
  const [dLat, dLon] = city.trip.destination.split(',').map(Number);

  const res = await fetch(`${API_GATEWAY}/api/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originLat: oLat,
      originLon: oLon,
      destLat:   dLat,
      destLon:   dLon,
      cityId:    city.id,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Route API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    transit_minutes:    data.transit_minutes,
    drive_minutes:      data.drive_minutes,
    walk_minutes:       data.walk_minutes,
    wait_minutes:       data.wait_minutes,
    wait_pct:           data.wait_pct,
    transfers:          data.transfers,
    ratio:              data.pain_factor,
    route_summary:      `${data.origin_stop} → ${data.dest_stop}`,
    next_departure_min: 0,
    legs:               [],
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
