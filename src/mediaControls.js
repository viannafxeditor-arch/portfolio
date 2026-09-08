export const INITIAL_VIDEO_VOLUME = 0.35;

export function clampSeek(time, duration) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.max(0, Math.min(Number.isFinite(time) ? time : 0, duration));
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const hours = Math.floor(safe / 3600);
  return `${hours ? `${hours}:` : ""}${hours ? String(Math.floor(safe / 60) % 60).padStart(2, "0") : Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export function fullscreenVideoLayout(width, height, aspectRatio, chromeHeight = 0, fit = "cover") {
  const ratio = aspectRatio > 0 ? aspectRatio : 16 / 9;
  const videoWidth = Math.min(width, Math.max(1, height - chromeHeight) * ratio);
  const videoHeight = videoWidth / ratio;
  const scale = fit === "contain" ? Math.min(width / videoWidth, height / videoHeight) : Math.max(width / videoWidth, height / videoHeight);
  return { width: videoWidth, height: videoHeight, scale };
}

export function createIdleCountdown(onIdle, clock = globalThis) {
  let timer;
  const cancel = () => clock.clearTimeout(timer);
  return {
    cancel,
    restart() { cancel(); timer = clock.setTimeout(onIdle, 2000); },
  };
}
