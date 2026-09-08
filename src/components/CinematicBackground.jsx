import { useEffect, useReducer, useRef, useState } from "react";
import { usePreviewVideo } from "../hooks/usePreviewVideo.js";
import { selectBackgroundMedia } from "../backgroundMedia.js";
import { cinematicFadeReducer, fadeDuration, guardCinematicBoundary } from "../cinematicFade.js";

function AmbientLayer({ clip, incoming, fading, duration, paused, transitioning, containerRef, onEnded, onReady, onFadeComplete, videos }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const timeline = selectBackgroundMedia(clip.videoSrc).excerpt;
  const baked = usePreviewVideo(containerRef, videoRef, clip, paused, !incoming && !transitioning ? onEnded : undefined, incoming || transitioning);
  useEffect(() => {
    const video = videoRef.current;
    videos.current.set(clip.id, video);
    const stop = timeline?.safeEnd ? guardCinematicBoundary(video, timeline.safeEnd) : () => {};
    return () => { stop(); videos.current.delete(clip.id); };
  }, [clip.id, timeline, videos]);
  return <div className={`ambient-layer ${incoming ? "is-incoming" : "is-base"} ${fading ? "is-fading" : ""} ${ready ? "is-ready" : ""}`}
    onTransitionEnd={event => {
      if (incoming && fading && event.target === event.currentTarget && event.propertyName === "opacity") onFadeComplete(clip.id);
    }}
    style={{ backgroundImage: `url("${clip.poster}")`, "--scene-fade-duration": `${duration || 0}ms` }}>
    <video ref={videoRef} className={baked ? "is-baked-preview" : undefined} muted playsInline preload="none" aria-hidden="true"
      onEmptied={() => setReady(false)}
      onPlaying={() => { setReady(true); if (incoming) onReady(clip.id, videoRef.current); }} />
  </div>;
}

export function CinematicBackground({ clip, paused, containerRef, onEnded }) {
  const [layers, dispatch] = useReducer(cinematicFadeReducer, clip, base => ({ base, incoming: null, phase: "idle" }));
  const videos = useRef(new Map());
  useEffect(() => { dispatch({ type: "request", clip }); }, [clip, layers.phase]);
  useEffect(() => {
    if (layers.phase === "loading" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dispatch({ type: "ready", id: layers.incoming.id, duration: 0 });
    }
  }, [layers.phase, layers.incoming]);
  useEffect(() => {
    if (layers.phase !== "fading") return;
    const timer = setTimeout(() => dispatch({ type: "finish", id: layers.incoming.id }), layers.duration ? layers.duration + 100 : 0);
    return () => clearTimeout(timer);
  }, [layers.phase, layers.incoming, layers.duration]);

  function ready(id, video) {
    const outgoing = videos.current.get(layers.base.id);
    const from = selectBackgroundMedia(layers.base.videoSrc).excerpt;
    const to = selectBackgroundMedia(layers.incoming?.videoSrc).excerpt;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : fadeDuration(
      (from?.safeEnd ?? outgoing?.duration ?? 0) - (outgoing?.currentTime || 0),
      (to?.safeEnd ?? video.duration) - video.currentTime, from?.fadeSeconds);
    dispatch({ type: "ready", id, duration });
  }
  return <div className="ambient-backdrop" aria-hidden="true">
    {[layers.base, layers.incoming].filter(Boolean).map(item => <AmbientLayer key={item.id} clip={item}
      incoming={item.id !== layers.base.id} fading={layers.phase === "fading"} duration={layers.duration}
      transitioning={layers.phase !== "idle"} paused={paused} containerRef={containerRef}
      onEnded={() => { if (clip.id === layers.base.id) onEnded?.(); }} onReady={ready} onFadeComplete={id => dispatch({ type: "finish", id })} videos={videos} />)}
  </div>;
}
