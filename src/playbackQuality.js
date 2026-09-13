import bitrates from "./playbackBitrates.json" with { type: "json" };

const rate = quality => bitrates[quality.src] ?? 0;

export function selectPlaybackQuality(qualities, { height = 1080, maxMbps = 12 } = {}) {
  const ordered = [...qualities].sort((a, b) => b.height - a.height || a.fps - b.fps);
  return ordered.find(q => q.height <= height && q.fps <= 60 && rate(q) <= maxMbps)
    || ordered.at(-1);
}

export function lighterPlaybackQuality(qualities, source) {
  const current = qualities.find(q => q.src === source);
  if (!current) return undefined;
  return [...qualities].filter(q => q.height < current.height && (!rate(current) || rate(q) < rate(current)))
    .sort((a, b) => b.height - a.height)[0];
}

export function backgroundViewport(width, height) {
  // Backgrounds have no player controls: avoid decoding 4K merely for device density.
  const scale = Math.min(1, 1920 / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function watchPlaybackPressure(video, onPressure, clock = globalThis) {
  let previous, slowSamples = 0;
  const timer = clock.setInterval(() => {
    const next = video.getVideoPlaybackQuality?.();
    if (!next || video.paused || video.seeking || video.readyState < 3) {
      previous = next; slowSamples = 0; return;
    }
    if (previous) {
      const total = next.totalVideoFrames - previous.totalVideoFrames;
      const dropped = next.droppedVideoFrames - previous.droppedVideoFrames;
      slowSamples = total >= 45 && dropped / total > .08 ? slowSamples + 1 : 0;
      if (slowSamples >= 2) { slowSamples = 0; onPressure(); }
    }
    previous = next;
  }, 3000);
  return () => clock.clearInterval(timer);
}
