// workers/pain-factor-cron/index.js
// ── Runs every 6 hours ────────────────────────────────────────────────────────
// Calls OpenTripPlanner (self-hosted on Oracle Cloud free tier) for each city,
// computes real transit vs drive pain factor, writes to KV.
// Zero API cost — OTP is free and open source.

import { CITIES, BOUNDS, normalize, computeScore } from "../../shared/cities.js";

export default {
  async scheduled(event, env, ctx) {
    console.log("pain-factor-cron: starting", new Date().toISOString());

    const otpBase = env.OTP_URL;
    if (!otpBase) {
      console.error("OTP_URL not set — run: wrangler secret put OTP_URL");
      return;
    }

    const healthy = await checkOTPHealth(otpBase);
    if (!healthy) {
      console.error("OTP health check failed — aborting run");
      await env.TRANSIT_KV.put("pain:last_error", JSON.stringify({
        error: "OTP unreachable",
        at: new Date().toISOString(),
      }));
      return;
    }

    const results = [];

    for (const city of CITIES) {
      try {
        console.log(`Computing pain factor: ${city.name}`);
        const pain = await computePainFactor(city, otpBase);

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
          walk_minutes: pain.walk_minutes,
          wait_minutes: pain.wait_minutes,
          transfers: pain.transfers,
          route_summary: pain.route_summary,
          pain_score: normalize(pain.ratio, BOUNDS.pain, "lower_better"),
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
        results.push({ city: city.id, status: "ok", ...pain });
        await sleep(500);

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: "error", error: err.message });
      }
    }

    await env.TRANSIT_KV.put("pain:last_run", JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log("pain-factor-cron: done");
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/run") {
      await this.scheduled({}, env, {});
      return new Response(JSON.stringify({ status: "done" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/health") {
      const otpBase = env.OTP_URL;
      const healthy = otpBase ? await checkOTPHealth(otpBase) : false;
      return new Response(JSON.stringify({
        otp_healthy: healthy,
        otp_url: otpBase ? otpBase.replace(/\/\/.*@/, "//[REDACTED]@") : "not set",
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname.startsWith("/test/")) {
      const cityId = url.pathname.split("/")[2];
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return new Response("City not found", { status: 404 });
      const pain = await computePainFactor(city, env.OTP_URL);
      return new Response(JSON.stringify(pain, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      "pain-factor-cron (OTP)\n\nEndpoints:\n  /run\n  /health\n  /test/:cityId"
    );
  },
};

// ── OTP Health Check ──────────────────────────────────────────────────────────

async function checkOTPHealth(otpBase) {
  try {
    const res = await fetch(`${otpBase}/otp/routers/default/index/feeds`, {
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Pain Factor via OTP ───────────────────────────────────────────────────────

async function computePainFactor(city, otpBase) {
  const [oLat, oLon] = city.trip.origin.split(",");
  const [dLat, dLon] = city.trip.destination.split(",");
  const departureTime = getNextWeekday8am();

  const [transitPlan, drivePlan] = await Promise.all([
    fetchOTPPlan({ otpBase, fromLat: oLat, fromLon: oLon, toLat: dLat, toLon: dLon,
                   time: departureTime, mode: "TRANSIT,WALK" }),
    fetchOTPPlan({ otpBase, fromLat: oLat, fromLon: oLon, toLat: dLat, toLon: dLon,
                   time: departureTime, mode: "CAR" }),
  ]);

  const transitItinerary = transitPlan?.plan?.itineraries?.[0];
  const driveItinerary   = drivePlan?.plan?.itineraries?.[0];

  if (!transitItinerary || !driveItinerary) {
    throw new Error(`OTP returned no itinerary for ${city.id}`);
  }

  const transitMinutes = Math.round(transitItinerary.duration / 60);
  const driveMinutes   = Math.round(driveItinerary.duration / 60);
  const ratio          = Math.round((transitMinutes / driveMinutes) * 10) / 10;

  const legs        = transitItinerary.legs || [];
  const walkLegs    = legs.filter(l => l.mode === "WALK");
  const walkMinutes = Math.round(walkLegs.reduce((s, l) => s + l.duration, 0) / 60);
  const waitMinutes = Math.round((transitItinerary.waitingTime || 0) / 60);
  const transfers   = transitItinerary.transfers || 0;

  return {
    transit_minutes: transitMinutes,
    drive_minutes:   driveMinutes,
    walk_minutes:    walkMinutes,
    wait_minutes:    waitMinutes,
    transfers,
    ratio,
    route_summary: buildRouteSummary(legs),
  };
}

async function fetchOTPPlan({ otpBase, fromLat, fromLon, toLat, toLon, time, mode }) {
  const params = new URLSearchParams({
    fromPlace: `${fromLat},${fromLon}`,
    toPlace:   `${toLat},${toLon}`,
    time:      formatTime(time),
    date:      formatDate(time),
    mode,
    numItineraries: "1",
    maxWalkDistance: "1500",
  });

  const res = await fetch(`${otpBase}/otp/routers/default/plan?${params}`, {
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`OTP plan failed: ${res.status}`);
  return res.json();
}

function buildRouteSummary(legs) {
  return legs
    .filter(l => l.mode !== "WALK" || l.duration > 60)
    .map(l => {
      if (l.mode === "WALK") return `Walk ${Math.round(l.duration / 60)}m`;
      return `${l.mode} ${l.route || l.routeShortName || ""} (${Math.round(l.duration / 60)}m)`.trim();
    })
    .join(" → ");
}

function getNextWeekday8am() {
  const d = new Date();
  d.setUTCHours(8, 0, 0, 0);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6 || d <= new Date()) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function formatTime(date) {
  return date.toUTCString().split(" ")[4];
}

function formatDate(date) {
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${m}-${d}-${date.getUTCFullYear()}`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
