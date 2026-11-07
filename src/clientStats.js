import { clientChannels } from "../shared/clientChannels.js";

export function validateClientStats(payload) {
  if (!payload || typeof payload.checkedAt !== "string" || !Number.isFinite(Date.parse(payload.checkedAt)) || !Array.isArray(payload.counts)) throw new Error("Invalid statistics response");
  const counts = clientChannels.map(client => {
    const item = payload.counts.find(item => item.channelId === client.channelId);
    if (!item || (item.subscribers !== null && (!Number.isSafeInteger(item.subscribers) || item.subscribers < 0))) throw new Error("Invalid subscriber count");
    return { channelId: client.channelId, subscribers: item.subscribers };
  });
  return { checkedAt: payload.checkedAt, counts };
}
