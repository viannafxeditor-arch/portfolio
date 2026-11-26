// Server-only YouTube lookup. Never expose the key to the browser.
export async function videoDetailsResponse(key, fetcher = fetch) {
  const headers = { "Cache-Control": "no-store" };
  if (!key) return Response.json({ error: "unavailable" }, { status: 503, headers });
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams({ part: "snippet,statistics,contentDetails", id: "rH3nU3F1oF8,GpLefsKpu-g", key });
    const response = await fetcher(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Unavailable");
    const items = (await response.json()).items || [];
    const count = value => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
    const videos = items.filter(item => item.snippet && item.statistics).map(item => ({
      id: item.id, title: item.snippet.title, creator: item.snippet.channelTitle.trim(),
      channelId: item.snippet.channelId, duration: item.contentDetails?.duration || null,
      views: count(item.statistics.viewCount), likes: count(item.statistics.likeCount),
    }));
    const first = videos.find(item => item.id === "rH3nU3F1oF8");
    if (!first) throw new Error("Unavailable");
    // Preserve the original shape for visitors with the previous frontend cached.
    return Response.json({ ...first, videos }, { headers });
  } catch { return Response.json({ error: "unavailable" }, { status: 502, headers }); }
}
