import { clientChannels } from "../shared/clientChannels.js";

export async function getClientStats(apiKey, fetcher = fetch) {
  if (!apiKey) throw new Error("YouTube API is not configured");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.search = new URLSearchParams({ part: "statistics", id: clientChannels.map(client => client.channelId).join(","), key: apiKey });
  const response = await fetcher(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("YouTube statistics unavailable");
  const payload = await response.json();
  const counts = clientChannels.map(client => {
    const item = payload.items?.find(item => item.id === client.channelId);
    if (!item?.statistics) throw new Error("Incomplete YouTube statistics");
    const hidden = item.statistics.hiddenSubscriberCount === true;
    const raw = item.statistics.subscriberCount;
    const subscribers = hidden ? null : /^\d+$/.test(String(raw)) ? Number(raw) : NaN;
    if (!hidden && !Number.isSafeInteger(subscribers)) throw new Error("Invalid YouTube statistics");
    return { channelId: client.channelId, subscribers };
  });
  return { checkedAt: new Date().toISOString(), counts };
}

export async function clientStatsResponse(apiKey, fetcher = fetch) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (!apiKey) return Response.json({ error: "not_configured" }, { status: 503, headers });
  try { return Response.json(await getClientStats(apiKey, fetcher), { headers }); }
  catch { return Response.json({ error: "temporarily_unavailable" }, { status: 502, headers }); }
}
