# Deploy fixsactransit frontend

## Vercel (recommended — zero config)

1. Push repo to GitHub
2. Connect to Vercel: https://vercel.com/new
3. Deploy — no env vars needed, API is public

## Cloudflare Pages

1. Push to GitHub
2. Cloudflare Dashboard → Pages → Create project
3. Build command: `npm run build`
4. Output directory: `.next`
5. Framework preset: Next.js

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## What's live

- Hero: pain ratio from `/api/scores/sacramento`
- Cities table: all 12 cities from `/api/scores` (others show — until data lands)
- Trip planner: uses Sacramento system data, address routing in Stage 2
- ISR: page revalidates every 5 minutes automatically
