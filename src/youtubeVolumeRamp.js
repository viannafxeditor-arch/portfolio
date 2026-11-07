// Increase only while playing; a manual volume change or mute cancels the ramp.
export function createYouTubeVolumeRamp(player, timers = globalThis) {
  let timer = null;
  let volume = 30;
  let done = false;
  const pause = () => { if (timer !== null) timers.clearInterval(timer); timer = null; };
  player.setVolume(volume);
  return {
    start() {
      if (done || timer !== null) return;
      timer = timers.setInterval(() => {
        if (player.isMuted() || Math.abs(player.getVolume() - volume) > 1) {
          done = true;
          pause();
          return;
        }
        volume = Math.min(50, volume + 1);
        player.setVolume(volume);
        if (volume === 50) { done = true; pause(); }
      }, 250);
    },
    pause,
    destroy() { done = true; pause(); },
  };
}
