// Budget against the first continuous run, not the duration of a looped derivative.
export function cinematicWindow(media) {
  const start = media.excerpt.start;
  const safeEnd = Math.max(start + .1, Math.min(media.duration, media.sourceDuration - media.sourceStart) - .12);
  const fadeSeconds = Math.min(1.4, (safeEnd - start) * .28);
  const end = Math.max(start + .05, Math.min(media.excerpt.end, safeEnd - fadeSeconds - .45));
  return { start, end, safeEnd, fadeSeconds };
}

export function fadeDuration(outgoingRemaining, incomingRemaining, preferred = 1.4) {
  return Math.max(.16, Math.min(preferred, outgoingRemaining - .12, incomingRemaining - .12)) * 1000;
}

export function cinematicFadeReducer(state, action) {
  if (action.type === "request") {
    if (state.phase === "fading") return state; // The caller retains the latest request.
    if (action.clip.id === state.base.id) return state.incoming ? { base: state.base, incoming: null, phase: "idle" } : state;
    if (action.clip.id === state.incoming?.id) return state;
    return { base: state.base, incoming: action.clip, phase: "loading" };
  }
  if (action.type === "ready" && state.phase === "loading" && state.incoming?.id === action.id) {
    return { ...state, phase: "fading", duration: action.duration };
  }
  if (action.type === "finish" && state.phase === "fading" && state.incoming?.id === action.id) {
    return { base: state.incoming, incoming: null, phase: "idle" };
  }
  return state;
}

// A slow load must never expose either an encoded wrap or a native loop.
// Normally the fade has already removed this layer before this guard is reached.
export function guardCinematicBoundary(video, safeEnd) {
  let frame, disposed = false;
  const check = () => {
    if (!video.seeking && video.currentTime >= safeEnd && !video.paused) video.pause();
  };
  const tick = () => {
    check();
    if (!disposed && video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(tick);
  };
  video.addEventListener("timeupdate", check);
  if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(tick);
  return () => {
    disposed = true;
    video.removeEventListener("timeupdate", check);
    if (frame != null) video.cancelVideoFrameCallback?.(frame);
  };
}
