import { watchCinematicExcerpt } from "../cinematicExcerpt.js";
import { useEffect, useRef } from "react";
import { useViewportVideo } from "./useViewportVideo.js";
import { useBackgroundMedia } from "./useBackgroundMedia.js";

// Background-only media never changes the full-quality source used by the player.
export function usePreviewVideo(containerRef, videoRef, project, suspended, onExcerptEnded, outgoing = false) {
  const { src: source, excerpt, baked, playbackRate } = useBackgroundMedia(project?.videoSrc);
  const callback = useRef(onExcerptEnded);
  callback.current = onExcerptEnded;
  useViewportVideo(containerRef, videoRef, source && excerpt?.start ? `${source}#t=${excerpt.start}` : source, suspended, playbackRate);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !excerpt) return;
    return watchCinematicExcerpt(video, excerpt, { suspended, outgoing, onEnded: onExcerptEnded ? () => callback.current?.() : undefined });
  }, [videoRef, source, excerpt, suspended, outgoing, Boolean(onExcerptEnded)]);
  return baked;
}
