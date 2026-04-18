export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/ping") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (path === "/api/sacramento") {
      const data = await env.TRANSIT_KV.get("city:sacramento", "json");
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("fixsactransit api");
  }
};