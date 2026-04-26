// workers/pain-factor-cron/index.js
// ── Runs every 6 hours ────────────────────────────────────────────────────────
// Delegates to api-gateway POST /api/seed/pain via service binding.
// No Dijkstra, no graph loading, no CPU limit issues.

async function triggerSeedPain(env) {
  const res = await env.API_GATEWAY.fetch('https://api-gateway/api/seed/pain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`api-gateway returned ${res.status}`);
  return res.json();
}

export default {
  async scheduled(event, env, ctx) {
    console.log('pain-factor-cron: starting', new Date().toISOString());
    try {
      const result = await triggerSeedPain(env);
      await env.TRANSIT_KV.put('pain:last_run', JSON.stringify({
        ran_at: new Date().toISOString(),
        source: 'google_routes',
        results: result.results,
      }));
      console.log('pain-factor-cron: done', result.results);
    } catch (err) {
      console.error('pain-factor-cron: failed', err.message);
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/run') {
      try {
        const result = await triggerSeedPain(env);
        await env.TRANSIT_KV.put('pain:last_run', JSON.stringify({
          ran_at: new Date().toISOString(),
          source: 'google_routes',
          results: result.results,
        }));
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }, null, 2), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname === '/status') {
      const last = await env.TRANSIT_KV.get('pain:last_run', 'json');
      return new Response(JSON.stringify(last ?? { status: 'never_run' }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      'pain-factor-cron\n\nEndpoints:\n  /run    — trigger now\n  /status — last run info',
    );
  },
};
