import { INITIAL_VIDEO_VOLUME } from "./mediaControls.js";

export const BACKGROUND_RELEASE_MS = 1200;
export const BACKGROUND_START_MS = 120;

// One owner per video. A paused offscreen element must not retain its decoder.
export function createBackgroundPlayback(video, source, rate, {
  schedule = setTimeout, cancel = clearTimeout, suspended = false,
} = {}) {
  let visible = false, hidden = false, reducedMotion = false, disposed = false;
  let startTimer, releaseTimer, pendingPlay = false, resumeTime = 0;
  const wanted = () => visible && !suspended && !hidden && !reducedMotion && !disposed;
  video.volume = INITIAL_VIDEO_VOLUME;
  video.muted = true;

  function release() {
    releaseTimer = undefined;
    if (video.getAttribute("src")) {
      if (video.readyState && Number.isFinite(video.currentTime)) resumeTime = video.currentTime;
      video.pause();
      video.removeAttribute("src");
      video.load(); // Cancel downloads and release decoder/buffer surfaces.
    }
  }
  function restorePosition() {
    if (resumeTime > 0 && Number.isFinite(video.duration)) video.currentTime = Math.min(resumeTime, Math.max(0, video.duration - .05));
  }
  function play() {
    startTimer = undefined;
    if (!wanted()) return;
    if (!video.getAttribute("src")) {
      video.src = source;
      video.load();
    }
    video.playbackRate = rate;
    if (pendingPlay || !video.paused) return;
    pendingPlay = true;
    Promise.resolve(video.play()).catch(() => {}).finally(() => {
      pendingPlay = false;
      if (!wanted()) video.pause();
    });
  }
  function update() {
    if (disposed) return;
    if (wanted()) {
      cancel(releaseTimer);
      releaseTimer = undefined;
      if (startTimer == null) startTimer = schedule(play, BACKGROUND_START_MS);
    } else {
      cancel(startTimer);
      startTimer = undefined;
      video.pause();
      if (hidden || reducedMotion) {
        cancel(releaseTimer);
        release();
      } else if (releaseTimer == null) releaseTimer = schedule(release, BACKGROUND_RELEASE_MS);
    }
  }
  video.addEventListener("loadedmetadata", restorePosition);
  return {
    setVisible(value) { visible = value; update(); },
    setSuspended(value) { suspended = value; update(); },
    setHidden(value) { hidden = value; update(); },
    setReducedMotion(value) { reducedMotion = value; update(); },
    destroy() {
      disposed = true;
      cancel(startTimer);
      cancel(releaseTimer);
      video.removeEventListener("loadedmetadata", restorePosition);
      release();
    },
  };
}
