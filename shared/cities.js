// shared/cities.js
// ── City registry — all 12 cities ────────────────────────────────────────────
// Each city needs:
//   gtfs_static: public URL to their GTFS zip (no auth required)
//   gtfs_rt:     real-time vehicle positions feed URL
//   rt_key_env:  env var name for the API key (if required), or null
//   trip:        a standard ~5-mile downtown commute for pain factor calc
//   rail_feed:   does this agency expose real-time rail data publicly?

export const CITIES = [
  {
    id: "new_york",
    name: "New York",
    state: "NY",
    gtfs_static: "http://web.mta.info/developers/data/nyct/subway/google_transit.zip",
    gtfs_rt: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
    rt_key_env: "MTA_KEY",
    rail_feed: true,
    trip: {
      // Brooklyn to Midtown Manhattan — ~5 miles
      origin: "40.6501,-73.9496",
      destination: "40.7549,-73.9840",
    },
  },
  {
    id: "chicago",
    name: "Chicago",
    state: "IL",
    gtfs_static: "https://www.transitchicago.com/downloads/sch_data/google_transit.zip",
    gtfs_rt: "https://lapi.transitchicago.com/api/1.0/ttpositions.aspx",
    rt_key_env: "CTA_KEY",
    rail_feed: true,
    trip: {
      // Logan Square to The Loop — ~5 miles
      origin: "41.9218,-87.7086",
      destination: "41.8827,-87.6233",
    },
  },
  {
    id: "washington_dc",
    name: "Washington DC",
    state: "DC",
    gtfs_static: "https://gtfs.wmata.com/gtfs/google_transit.zip",
    gtfs_rt: "https://api.wmata.com/gtfs/bus-gtfsrt-vehiclepositions.pb",
    rt_key_env: "WMATA_KEY",
    rail_feed: true,
    trip: {
      // Columbia Heights to Downtown DC — ~4.5 miles
      origin: "38.9288,-77.0326",
      destination: "38.8977,-77.0366",
    },
  },
  {
    id: "san_francisco",
    name: "San Francisco",
    state: "CA",
    gtfs_static: "https://gtfs.sfmta.com/transitdata/google_transit.zip",
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
    id: "seattle",
    name: "Seattle",
    state: "WA",
    gtfs_static: "https://metro.kingcounty.gov/GTFS/google_transit.zip",
    gtfs_rt: "https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions.pb",
    rt_key_env: null,
    rail_feed: true,
    trip: {
      // Capitol Hill to Downtown Seattle — ~2.5 miles
      origin: "47.6233,-122.3205",
      destination: "47.6062,-122.3321",
    },
  },
  {
    id: "los_angeles",
    name: "Los Angeles",
    state: "CA",
    gtfs_static: "https://gtfs.metro.net/agencies/lax/subdir/google_transit.zip",
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
    id: "portland",
    name: "Portland",
    state: "OR",
    gtfs_static: "https://developer.trimet.org/schedule/gtfs.zip",
    gtfs_rt: "https://developer.trimet.org/ws/V1/VehiclePositions/appID/{TRIMET_KEY}",
    rt_key_env: "TRIMET_KEY",
    rail_feed: true,
    trip: {
      // Alberta Arts District to Downtown Portland — ~5 miles
      origin: "45.5575,-122.6466",
      destination: "45.5231,-122.6765",
    },
  },
  {
    id: "denver",
    name: "Denver",
    state: "CO",
    gtfs_static: "https://www.rtd-denver.com/files/gtfs/google_transit.zip",
    gtfs_rt: "https://www.rtd-denver.com/files/gtfs-rt/VehiclePositions.pb",
    rt_key_env: null,
    rail_feed: true,
    trip: {
      // Five Points to Downtown Denver — ~2 miles
      origin: "39.7575,-104.9772",
      destination: "39.7505,-104.9963",
    },
  },
  {
    id: "minneapolis",
    name: "Minneapolis",
    state: "MN",
    gtfs_static: "https://svc.metrotransit.org/mtgtfs/gtfs.zip",
    gtfs_rt: "https://svc.metrotransit.org/mtgtfs/vehiclepositions.pb",
    rt_key_env: null,
    rail_feed: true,
    trip: {
      // Uptown to Downtown Minneapolis — ~3.5 miles
      origin: "44.9473,-93.2990",
      destination: "44.9778,-93.2650",
    },
  },
  {
    id: "phoenix",
    name: "Phoenix",
    state: "AZ",
    gtfs_static: "https://www.valleymetro.org/sites/default/files/uploads/gtfs-files/google_transit.zip",
    gtfs_rt: "https://api.valleymetro.org/feeds/gtfs-rt/vehiclepositions",
    rt_key_env: null,
    rail_feed: false,
    trip: {
      // Tempe to Downtown Phoenix — ~7 miles
      origin: "33.4255,-111.9400",
      destination: "33.4484,-112.0740",
    },
  },
  {
    id: "san_jose",
    name: "San Jose",
    state: "CA",
    gtfs_static: "https://www.vta.org/go/developers",
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
    id: "sacramento",
    name: "Sacramento",
    state: "CA",
    gtfs_static: "https://www.sacrt.com/googletransit/googlegtfs.zip",
    gtfs_rt: "https://api.goswift.ly/real-time/sacrt/gtfs-rt-vehicle-position",
    rt_key_env: "SACRT_KEY",
    // The point of the whole project
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
  frequency: 0.40,  // avg peak headway
  coverage:  0.30,  // % of city within 400m of a stop
  pain:      0.30,  // transit/drive ratio (inverted)
};

// ── Normalization bounds ──────────────────────────────────────────────────────
export const BOUNDS = {
  // headway: lower is better (5min = excellent, 60min = terrible)
  headway:  { best: 5,  worst: 60 },
  // coverage: higher is better (90% = excellent, 20% = terrible)
  coverage: { best: 90, worst: 20 },
  // pain factor: lower is better (1x = same as driving, 8x = terrible)
  pain:     { best: 1,  worst: 8  },
};

// Normalize any metric to 0–10 scale
// direction: 'lower_better' or 'higher_better'
export function normalize(value, bounds, direction = "lower_better") {
  const { best, worst } = bounds;
  const clamped = Math.max(Math.min(value, worst), best);
  const ratio = direction === "lower_better"
    ? (worst - clamped) / (worst - best)
    : (clamped - worst) / (best - worst);
  return Math.round(ratio * 100) / 10; // 0.0–10.0
}

export function computeScore(frequency, coverage, pain) {
  return (
    normalize(frequency, BOUNDS.headway,  "lower_better")  * WEIGHTS.frequency +
    normalize(coverage,  BOUNDS.coverage, "higher_better") * WEIGHTS.coverage  +
    normalize(pain,      BOUNDS.pain,     "lower_better")  * WEIGHTS.pain
  ).toFixed(1);
}
