import { clientStatsResponse } from "../server/clientStats.js";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = (env.CLIENTS_ALLOWED_ORIGINS || "https://www.viannafx.media,https://viannafx.media").split(",").map(value => value.trim());
    if (!origin || !allowed.includes(origin)) return new Response(null, { status: 403 });
    const headers = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, OPTIONS", "Cache-Control": "no-store", Vary: "Origin" };
    if (new URL(request.url).pathname !== "/api/clients") return new Response(null, { status: 404, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "GET") return new Response(null, { status: 405, headers: { ...headers, Allow: "GET, OPTIONS" } });
    if (!env.CLIENTS_RATE_LIMIT) return Response.json({ error: "temporarily_unavailable" }, { status: 503, headers });
    const { success } = await env.CLIENTS_RATE_LIMIT.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
    if (!success) return Response.json({ error: "too_many_requests" }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
    const response = await clientStatsResponse(env.YOUTUBE_API_KEY || env.YT);
    for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
    return response;
  },
};
