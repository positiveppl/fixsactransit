# fixsactransit — Data Pipeline Handoff

## What's built

Three Cloudflare Workers that form the data backbone for fixsactransit.org:

```
workers/
  gtfs-score-cron/    → Downloads GTFS static zips, computes frequency + coverage
  pain-factor-cron/   → Calls Mapbox for transit vs drive times per city
  api-gateway/        → Public API with CORS, serves scores + proxies live feeds
shared/
  cities.js           → All 12 cities, GTFS URLs, scoring config
```

---

## Setup (in order)

### 1. Install wrangler

```bash
npm install
npx wrangler login
```

### 2. Create KV namespace

```bash
npm run kv:create
# Copy the ID it gives you

npm run kv:create-preview
# Copy the preview ID
```

Open `wrangler.toml` and replace both `REPLACE_WITH_YOUR_KV_ID` placeholders
with your actual IDs.

### 3. Set secrets

```bash
npx wrangler secret put MAPBOX_TOKEN
# Paste your Mapbox public token

# API keys for city feeds (get free keys from each agency):
npx wrangler secret put MTA_KEY        # api.mta.info — free
npx wrangler secret put WMATA_KEY      # developer.wmata.com — free
npx wrangler secret put TRIMET_KEY     # developer.trimet.org — free
npx wrangler secret put SF511_KEY      # 511.org/open-data — free
npx wrangler secret put SACRT_KEY      # goswift.ly — contact SacRT
npx wrangler secret put CTA_KEY        # developer.transitchicago.com — free
```

### 4. Deploy all three workers

```bash
npm run deploy:all
```

### 5. Seed initial data (don't wait for cron)

```bash
# Trigger GTFS processing manually
curl https://gtfs-score-cron.YOUR_SUBDOMAIN.workers.dev/run

# Trigger pain factor
curl https://pain-factor-cron.YOUR_SUBDOMAIN.workers.dev/run

# Check status
curl https://api-gateway.YOUR_SUBDOMAIN.workers.dev/api/status
```

### 6. Point the domain

In Cloudflare dashboard → Workers → api-gateway → Triggers → Routes:
Add: `fixsactransit.org/api/*`

---

## API Reference

| Endpoint | Description |
|---|---|
| `GET /api/scores` | All 12 cities ranked, with methodology |
| `GET /api/scores/sacramento` | Single city data |
| `GET /api/live/new_york` | Proxied GTFS-RT bus feed (protobuf) |
| `GET /api/status` | Pipeline health, last run times |

---

## City feed API keys

| City | Provider | URL | Notes |
|---|---|---|---|
| New York | MTA | api.mta.info | Free, instant |
| Washington DC | WMATA | developer.wmata.com | Free, instant |
| Portland | TriMet | developer.trimet.org | Free, instant |
| SF + San Jose | 511 SF Bay | 511.org/open-data | Free, one key for both |
| Chicago | CTA | developer.transitchicago.com | Free, instant |
| Denver | RTD | rtd-denver.com/files/gtfs-rt | No key needed |
| Seattle | King County Metro | No key needed | Public S3 bucket |
| Minneapolis | Metro Transit | No key needed | Public |
| Phoenix | Valley Metro | No key needed | Public |
| Sacramento | GoSwift.ly/SacRT | Contact SacRT directly | May need approval |

---

## Scoring methodology (publishable)

```
score = (frequency_score × 0.40) + (coverage_score × 0.30) + (pain_score × 0.30)
```

Each sub-score is normalized 0–10:

- **Frequency**: Average peak-hour headway (5 min = 10, 60 min = 0)
- **Coverage**: % of city within 400m of a stop (90% = 10, 20% = 0)
- **Pain factor**: Transit time / drive time (1× = 10, 8× = 0)

All source data is public GTFS. Methodology is open. Citable.

---

## What's next (Step 2: GTFS Parser)

The frequency + coverage computation in `gtfs-score-cron` is complete.
The pain factor in `pain-factor-cron` uses estimated multipliers for now.

**To get real transit routing:**

Option A (easiest): Use Google Maps Platform Transit Directions API
- Single API call, returns full itinerary
- ~$0.005/request × 12 cities × 4/day = $0.24/day

Option B (more control): Deploy OpenTripPlanner on a small VPS
- Ingest GTFS static feeds
- Query via REST API
- One-time setup, then free per-query
- Good Cloudflare Tunnel setup for Workers to call it

---

## Cron schedule

| Worker | Schedule | What it does |
|---|---|---|
| gtfs-score-cron | Daily 6am UTC | Downloads GTFS zips, computes frequency + coverage |
| pain-factor-cron | Every 6 hours | Updates transit vs drive times |

KV data has no TTL — scores persist until overwritten by next cron run.
