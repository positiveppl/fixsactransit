# fixsactransit

**Sacramento is the capital of the 5th largest economy on Earth. A 15-minute drive is currently 100 minutes by transit.**

fixsactransit is an open-source transit health analysis and visualization tool built to make Sacramento's public transit reality impossible to ignore — and to push for change.

→ **[fixsactransit.org](https://fixsactransit.org)**

---

## What It Does

- **Pain Ratio** — calculates how many times slower your commute is by transit vs. driving
- **Trip Planner** — enter any two Sacramento addresses, get a real routed transit trip with walk, wait, and ride breakdown
- **City Comparison** — benchmarks Sacramento's transit score against SF, LA, San Diego, and San Jose
- **Next Departures** — live schedule-based departures from your current location
- **Shareable Transit Ticket** — generates a receipt-style PNG card of your commute stats to share on social

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 18, TypeScript |
| Backend | Cloudflare Workers |
| Storage | Cloudflare KV |
| Data | Sacramento GTFS (SacRT) |
| Maps | Mapbox Search Box API |
| Routing | Custom transit graph (2,823 stops, 162,000 edges) |
| Deployment | Cloudflare Pages + Workers |

---

## Architecture

```
fixsactransit/
├── app/
│   ├── components/
│   │   ├── Hero.tsx              # Landing section
│   │   ├── Sidebar.tsx           # Pain factor, city comparison, departures
│   │   ├── TripPlanner.tsx       # Address input, routing, result card
│   │   ├── ShareTicket.tsx       # Shareable PNG transit ticket
│   │   ├── TransitMapbox.tsx     # Live vehicle map
│   │   ├── StatStrip.tsx         # System-wide stats bar
│   │   ├── Manifesto.tsx         # Call to action section
│   │   └── Nav.tsx
│   └── lib/
│       └── api.ts                # API client + shared types
├── workers/
│   ├── api-gateway/              # Central API gateway
│   ├── vehicles/                 # Vehicle position feed
│   ├── gtfs-score-cron/          # Scheduled GTFS score computation
│   └── pain-factor-cron/         # Scheduled pain ratio computation
├── shared/
│   └── cities.js                 # Static city benchmark data
└── scripts/
    ├── build-graph-local.mjs     # Build transit routing graph
    ├── compute-pain-local.mjs    # Compute pain factor locally
    └── reseed-static-cities.mjs  # Reseed city comparison data
```

---

## Key Metrics

- **Pain Ratio** — `transit_time / drive_time`. Sacramento averages ~4–6×.
- **Wait %** — percentage of total transit trip spent waiting at stops, not riding.
- **Transit Viability Score** — composite score used to rank cities.
- **Accessibility Gap Index** — jobs reachable by transit vs. car within 30 min (in development).

---

## Deployed Workers

| Worker | URL | Purpose |
|---|---|---|
| api-gateway | `api-gateway.msgpnn.workers.dev` | Central routing + departures API |
| vehicles | `vehicles.msgpnn.workers.dev` | Vehicle position data |
| gtfs-score-cron | `gtfs-score-cron.msgpnn.workers.dev` | Scheduled GTFS score updates |
| pain-factor-cron | `pain-factor-cron.msgpnn.workers.dev` | Scheduled pain ratio updates |

---

## Local Development

```bash
# Install dependencies
npm install

# Run the Next.js frontend
npm run dev

# Deploy all workers
npm run deploy:all

# Deploy individual workers
npm run deploy:gateway
npm run deploy:vehicles
npm run deploy:gtfs
npm run deploy:pain
```

---

## Why This Exists

Sacramento has 42 miles of light rail track with no public real-time API. Bus frequency averages one bus per hour in most corridors. The region's transit system is effectively invisible — even to itself.

This project exists to measure that gap, visualize it, and make it undeniable.

**We are the state capital. We can do better.**

---

## Running This for Your City

The core infrastructure is city-agnostic. If your city publishes a GTFS feed (most US transit agencies do), you can fork this and have it running for your city in a few hours.

### What you need

- A GTFS feed for your transit agency — find yours at [transitfeeds.com](https://transitfeeds.com) or your agency's developer portal
- A [Cloudflare account](https://cloudflare.com) (free tier is sufficient)
- A [Mapbox token](https://mapbox.com) (free tier is sufficient)
- Node.js 18+ and [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Step 1 — Get your GTFS data

Download your agency's GTFS zip and place it in the `scripts/` directory. Most agencies publish this publicly — search `[your city] transit GTFS feed`.

### Step 2 — Build the transit graph

```bash
node scripts/build-graph-local.mjs --gtfs ./scripts/your-city-gtfs.zip
```

This builds the routing graph (stops + edges) and writes it to Cloudflare KV.

### Step 3 — Update city-specific config

**`app/components/TripPlanner.tsx`** — update the Mapbox proximity bias to your city's coordinates:
```ts
url.searchParams.set('proximity', '-121.4944,38.5816') // ← swap for your city center
```

**`app/components/Sidebar.tsx`** — update the city comparison list:
```ts
const CA_CITY_IDS = ['san_francisco', 'los_angeles', ...] // ← swap for your region
```

**`shared/cities.js`** — add your city's baseline metrics or remove the comparison section entirely.

**`app/components/ShareTicket.tsx`** — the SVG skyline is Sacramento-specific. Swap it for your city or remove it.

**Copy throughout** — search for "Sacramento", "SacRT", and "State Capital" and update to your city.

### Step 4 — Deploy workers

```bash
# Set your secrets
wrangler secret put MAPBOX_TOKEN
wrangler secret put GOOGLE_ROUTES_API_KEY  # for drive time calculation

# Deploy
npm run deploy:all
```

### Step 5 — Set environment variables

In your Cloudflare Pages project settings, add:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_token
NEXT_PUBLIC_API_BASE=your-api-gateway.workers.dev
```

### Pain Ratio benchmarks by city

If you run this for your city, open a PR adding your results to `shared/cities.js`. The goal is to build a national picture of transit health — city by city.

| City | Pain Ratio | Status |
|---|---|---|
| Sacramento, CA | ~4.6× | ✅ Live |
| Your city | ? | 🔜 Add yours |

---

## Contributing

Issues and PRs welcome. If you live in Sacramento and want to help — open an issue, reach out, or just share your pain ratio.

Built something for your city? Open a PR — we want to see it.

---

## License

MIT
