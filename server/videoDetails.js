// Server-only YouTube lookup. Never expose the key to the browser.
export async function videoDetailsResponse(key, fetcher = fetch) {
  const headers = { "Cache-Control": "no-store" };
  if (!key) return Response.json({ error: "unavailable" }, { status: 503, headers });
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams({ part: "snippet,statistics,contentDetails", id: "rH3nU3F1oF8", key });
    const response = await fetcher(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Unavailable");
    const item = (await response.json()).items?.[0];
    if (!item?.snippet || !item.statistics) throw new Error("Unavailable");
    const count = value => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
    return Response.json({ id: item.id, title: item.snippet.title, creator: item.snippet.channelTitle,
      channelId: item.snippet.channelId, duration: item.contentDetails?.duration || null, views: count(item.statistics.viewCount), likes: count(item.statistics.likeCount) }, { headers });
  } catch { return Response.json({ error: "unavailable" }, { status: 502, headers }); }
}


