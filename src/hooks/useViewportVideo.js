import { useEffect, useRef } from "react";
import { createBackgroundPlayback } from "../backgroundPlayback.js";

// Keep observers stable when dialogs open; release resources when inactive.
export function useViewportVideo(containerRef, videoRef, mediaKey, suspended = false, playbackRate = 0.8) {
  const playbackRef = useRef(null);
  const suspendedRef = useRef(suspended);
  suspendedRef.current = suspended;
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !mediaKey) return;
    const playback = createBackgroundPlayback(video, mediaKey, playbackRate, { suspended: suspendedRef.current });
    playbackRef.current = playback;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateVisibility = () => playback.setHidden(document.hidden);
    const updateMotion = () => playback.setReducedMotion(motion.matches);
    updateVisibility();
    updateMotion();
    const observer = new IntersectionObserver(([entry]) => {
      playback.setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
    }, { threshold: [0, 0.55] });
    observer.observe(container);
    document.addEventListener("visibilitychange", updateVisibility);
    motion.addEventListener("change", updateMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      motion.removeEventListener("change", updateMotion);
      playback.destroy();
      playbackRef.current = null;
    };
  }, [containerRef, videoRef, mediaKey, playbackRate]);
  useEffect(() => { playbackRef.current?.setSuspended(suspended); }, [suspended, mediaKey]);
}
