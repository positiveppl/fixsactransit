// workers/api-gateway/index.js
// ── Public API for fixsactransit.org ─────────────────────────────────────────
//
// Routes:
//   GET /api/scores              → all city scores from KV
//   GET /api/scores/:cityId      → single city score
//   GET /api/live/:cityId        → proxy GTFS-RT vehicle positions (solves CORS)
//   GET /api/status              → pipeline health check
//
// Deploy to: fixsactransit.org/api/*

import { CITIES } from "../../shared/cities.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405);
    }

    // ── Route: GET /api/scores ──────────────────────────────────────────────
    if (path === "/api/scores") {
      return handleAllScores(env);
    }

    // ── Route: GET /api/scores/:cityId ──────────────────────────────────────
    const scoreMatch = path.match(/^\/api\/scores\/([a-z_]+)$/);
    if (scoreMatch) {
      return handleCityScore(scoreMatch[1], env);
    }

    // ── Route: GET /api/live/:cityId ─────────────────────────────────────────
    const liveMatch = path.match(/^\/api\/live\/([a-z_]+)$/);
    if (liveMatch) {
      return handleLiveFeed(liveMatch[1], env);
    }

    // ── Route: GET /api/status ───────────────────────────────────────────────
    if (path === "/api/status") {
      return handleStatus(env);
    }

    if (path === "/api/debug/sacramento") {
      const raw = await env.TRANSIT_KV.get("city:sacramento", { cacheTtl: 0 });
      return json({ raw_length: raw?.length, preview: raw?.slice(0, 200) });
    }

    return json({ error: "Not found", available: ["/api/scores", "/api/live/:cityId", "/api/status"] }, 404);
  },
};

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleAllScores(env) {
  const cityIds = CITIES.map(c => c.id);

  // Fetch all cities from KV in parallel
  const records = await Promise.all(
    cityIds.map(id => env.TRANSIT_KV.get(`city:${id}`, "json"))
  );

  // Merge KV data with static city config, fill nulls for uncached cities
  const cities = CITIES.map((city, i) => {
    const kv = records[i] || {};
    return {
      id: city.id,
      name: city.name,
      state: city.state,
      rail_feed: city.rail_feed,
      score: kv.score || null,
      frequency_score: kv.frequency_score || null,
      coverage_score: kv.coverage_score || null,
      pain_score: kv.pain_score || null,
      pain_factor: kv.pain_factor || null,
      transit_minutes: kv.transit_minutes || null,
      drive_minutes: kv.drive_minutes || null,
      avg_headway_minutes: kv.avg_headway_minutes || null,
      coverage_pct: kv.coverage_pct || null,
      stop_count: kv.stop_count || null,
      gtfs_computed_at: kv.gtfs_computed_at || null,
      pain_computed_at: kv.pain_computed_at || null,
    };
  });

  // Sort: highest score first, Sacramento will be last
  const sorted = [...cities].sort((a, b) => {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });

  return json({
    cities: sorted,
    methodology: {
      weights: { frequency: 0.40, coverage: 0.30, pain: 0.30 },
      frequency_bounds: { best: "5 min headway", worst: "60 min headway" },
      coverage_bounds: { best: "90% within 400m", worst: "20% within 400m" },
      pain_bounds: { best: "1x drive time", worst: "8x drive time" },
      source: "GTFS static feeds + Mapbox Directions API",
      updated: "Daily (frequency/coverage) + Every 6hrs (pain factor)",
    },
  });
}

async function handleCityScore(cityId, env) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return json({ error: `Unknown city: ${cityId}` }, 404);

  const kv = await env.TRANSIT_KV.get(`city:${cityId}`, "json");
  if (!kv) return json({ error: "No data yet — cron hasn't run", city: cityId }, 202);

  return json(kv);
}

async function handleLiveFeed(cityId, env) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return json({ error: `Unknown city: ${cityId}` }, 404);

  if (!city.gtfs_rt) {
    return json({ error: "No GTFS-RT feed configured for this city" }, 404);
  }

  // Special case: Sacramento has no rail feed — return empty with message
  if (cityId === "sacramento" && !city.rail_feed) {
    // Still proxy the bus feed, but include a note
  }

  try {
    // Build the feed URL, injecting API key if needed
    let feedUrl = city.gtfs_rt;
    if (city.rt_key_env) {
      const key = env[city.rt_key_env];
      if (!key) {
        return json({
          error: `API key not configured: ${city.rt_key_env}`,
          hint: `Run: wrangler secret put ${city.rt_key_env}`,
        }, 503);
      }
      feedUrl = feedUrl.replace(`{${city.rt_key_env}}`, key);
    }

    // Proxy the GTFS-RT protobuf feed
    // Cache for 15 seconds at Cloudflare edge
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "fixsactransit.org/1.0",
        ...(city.rt_key_env === "MTA_KEY" ? { "x-api-key": env[city.rt_key_env] } : {}),
        ...(city.rt_key_env === "WMATA_KEY" ? { "api_key": env[city.rt_key_env] } : {}),
      },
      cf: { cacheTtl: 15 },
    });

    if (!res.ok) {
      return json({ error: `Upstream feed error: ${res.status}` }, 502);
    }

    // Return the protobuf as-is — frontend decodes it
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=15",
        "X-City": cityId,
        "X-Rail-Feed": String(city.rail_feed),
        "X-Feed-URL": feedUrl.replace(env[city.rt_key_env] || "", "[REDACTED]"),
      },
    });

  } catch (err) {
    return json({ error: "Failed to fetch live feed", detail: err.message }, 502);
  }
}

async function handleStatus(env) {
  const [lastGtfs, lastPain] = await Promise.all([
    env.TRANSIT_KV.get("index:last_run", "json"),
    env.TRANSIT_KV.get("pain:last_run", "json"),
  ]);

  // Quick health check: count how many cities have scores
  const cityIds = CITIES.map(c => c.id);
  const records = await Promise.all(
    cityIds.map(id => env.TRANSIT_KV.get(`city:${id}`, "json"))
  );
  const withScores = records.filter(r => r?.score).length;

  return json({
    status: withScores > 0 ? "ok" : "no_data",
    cities_with_scores: withScores,
    total_cities: CITIES.length,
    last_gtfs_run: lastGtfs?.ran_at || null,
    last_pain_run: lastPain?.ran_at || null,
    next_steps: withScores === 0
      ? ["Trigger gtfs-score-cron: curl https://gtfs-score-cron.YOUR_SUBDOMAIN.workers.dev/run",
         "Trigger pain-factor-cron: curl https://pain-factor-cron.YOUR_SUBDOMAIN.workers.dev/run"]
      : [],
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
