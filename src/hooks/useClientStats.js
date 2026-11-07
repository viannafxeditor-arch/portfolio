import { useEffect, useState } from "react";
import { clientsCheckedAt } from "../clients.js";
import { validateClientStats } from "../clientStats.js";

export function useClientStats(clients) {
  const [data, setData] = useState(() => ({ clients, checkedAt: clientsCheckedAt, status: "loading" }));
  useEffect(() => {
    let controller;
    let timer;
    let active = true;
    const refresh = async () => {
      controller?.abort();
      clearTimeout(timer);
      const current = new AbortController();
      controller = current;
      timer = setTimeout(() => current.abort(), 10000);
      try {
        const endpoint = import.meta.env.VITE_CLIENTS_API_URL || "/api/clients";
        const response = await fetch(endpoint, { cache: "no-store", signal: current.signal });
        if (!response.ok) throw new Error("Statistics unavailable");
        const result = validateClientStats(await response.json());
        if (active && controller === current) setData({
          clients: clients.map(client => ({ ...client, subscribers: result.counts.find(item => item.channelId === client.channelId).subscribers })),
          checkedAt: result.checkedAt,
          status: "live",
        });
      } catch {
        if (active && controller === current) setData(previous => ({ ...previous, status: "saved" }));
      } finally { if (controller === current) clearTimeout(timer); }
    };
    // Defer one tick so React StrictMode's setup check doesn't duplicate requests.
    const initial = setTimeout(refresh, 0);
    const restore = event => { if (event.persisted) refresh(); };
    window.addEventListener("pageshow", restore);
    return () => { active = false; clearTimeout(initial); clearTimeout(timer); controller?.abort(); window.removeEventListener("pageshow", restore); };
  }, [clients]);
  return data;
}
