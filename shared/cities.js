// shared/cities.js
// ── City registry — California focus ─────────────────────────────────────────
// Scoped to CA cities for local impact and feed reliability.
// SF uses seeded data (sfmta.com feed is unreliable, 511 requires API key).

export const CITIES = [
  {
    id: "los_angeles",
    name: "Los Angeles",
    state: "CA",
    // LA Metro bus GTFS — GitLab repo, updated weekly, confirmed via Mobility Database
    gtfs_static: "https://gitlab.com/LACMTA/gtfs_bus/raw/master/gtfs_bus.zip",
    gtfs_rt: "https://api.metro.net/agencies/lax/vehicles/",
    rt_key_env: null,
    rail_feed: true,
    trip: {
      // Silver Lake to Downtown LA — ~5 miles
      origin: "34.0870,-118.2712",
      destination: "34.0522,-118.2437",
    },
  },
  {
    id: "san_francisco",
    name: "San Francisco",
    state: "CA",
    // sfmta.com direct feed times out (522). 511 requires API key.
    // Data seeded manually via seed-sf.sh — gtfs_static null skips the cron.
    gtfs_static: null,
    gtfs_rt: "https://api.511.org/transit/VehiclePositions?api_key={SF511_KEY}&agency=SF",
    rt_key_env: "SF511_KEY",
    rail_feed: true,
    trip: {
      // Mission District to Financial District — ~4 miles
      origin: "37.7599,-122.4148",
      destination: "37.7946,-122.3999",
    },
  },
  {
    id: "san_jose",
    name: "San Jose",
    state: "CA",
    // VTA official GTFS host — confirmed on gtfs.vta.org developer page
    gtfs_static: null,
    gtfs_rt: "https://api.511.org/transit/VehiclePositions?api_key={SF511_KEY}&agency=VTA",
    rt_key_env: "SF511_KEY",
    rail_feed: false,
    trip: {
      // Willow Glen to Downtown San Jose — ~4 miles
      origin: "37.3031,-121.9019",
      destination: "37.3382,-121.8863",
    },
  },
  {
    id: "san_diego",
    name: "San Diego",
    state: "CA",
    // MTS static GTFS — no auth required, confirmed active through Jun 2026 via Mobility Database
    gtfs_static: null, // sdmts.com blocks non-browser requests, data seeded manually
    // GTFS-RT requires OneBusAway API key — scoring works without it
    gtfs_rt: "https://realtime.sdmts.com/api/api/gtfs_realtime/vehicle-positions-for-agency/MTS.pb?key={SDMTS_KEY}",
    rt_key_env: "SDMTS_KEY",
    rail_feed: true,
    trip: {
      // North Park to Downtown San Diego — ~3 miles
      origin: "32.7479,-117.1294",
      destination: "32.7157,-117.1611",
    },
  },
  {
    id: "sacramento",
    name: "Sacramento",
    state: "CA",
    // iportal.sacrt.com confirmed active (Dec 2025 directory listing)
    gtfs_static: null,
    gtfs_rt: "https://api.goswift.ly/real-time/sacrt/gtfs-rt-vehicle-position",
    rt_key_env: "SACRT_KEY",
    rail_feed: false,
    trip: {
      // Oak Park to Downtown Sacramento — ~4 miles
      origin: "38.5516,-121.4685",
      destination: "38.5802,-121.4931",
    },
  },
];

// ── Scoring weights ───────────────────────────────────────────────────────────
export const WEIGHTS = {
  frequency: 0.40,
  coverage:  0.30,
  pain:      0.30,
};

export const BOUNDS = {
  headway:  { best: 5,  worst: 45 },
  coverage: { best: 90, worst: 10 },
  pain:     { best: 1,  worst: 8  },
};

export function normalize(value, bounds, direction = "lower_better") {
  const { best, worst } = bounds;
  const clamped = Math.max(Math.min(value, worst), best);
  const ratio = direction === "lower_better"
    ? (worst - clamped) / (worst - best)
    : (clamped - worst) / (best - worst);
  return Math.round(ratio * 100) / 10;
}

export function computeScore(frequency, coverage, pain) {
  return (
    normalize(frequency, BOUNDS.headway,  "lower_better")  * WEIGHTS.frequency +
    normalize(coverage,  BOUNDS.coverage, "higher_better") * WEIGHTS.coverage  +
    normalize(pain,      BOUNDS.pain,     "lower_better")  * WEIGHTS.pain
  ).toFixed(1);
}
