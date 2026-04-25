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

## Contributing

Issues and PRs welcome. If you live in Sacramento and want to help — open an issue, reach out, or just share your pain ratio.

---

## License

MIT
