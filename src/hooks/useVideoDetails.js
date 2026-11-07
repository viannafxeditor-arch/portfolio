import { useEffect, useState } from "react";
export function useVideoDetails() {
  const [details, setDetails] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const endpoint = import.meta.env.VITE_CLIENTS_API_URL ? new URL("/api/video-details", import.meta.env.VITE_CLIENTS_API_URL).href : "/api/video-details";
    fetch(endpoint, { signal: controller.signal, cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error("Unavailable"); return r.json(); })
      .then(setDetails).catch(() => {});
    return () => controller.abort();
  }, []);
  return details;
}
export function videoDuration(duration) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(duration || "");
  if (!match) return null;
  const seconds = Math.floor(Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0));
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
  return `${h ? h + ":" : ""}${h ? String(m).padStart(2,"0") : m}:${String(s).padStart(2,"0")}`;
}

