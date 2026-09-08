export function watchCinematicExcerpt(video, excerpt, { suspended = false, onEnded, outgoing = false } = {}) {
  // The fading layer stays on its original timeline until the next layer covers it.
  if (outgoing) return () => {};
  let frame;
  let disposed = false;
  let completed = false;
  const seekToMiddle = () => {
    if (!suspended && (video.currentTime < excerpt.start || (!onEnded && video.currentTime >= excerpt.end))) video.currentTime = excerpt.start;
  };
  const checkEnd = () => {
    if (disposed || suspended || completed || video.seeking) return;
    if (video.currentTime < excerpt.start) {
      video.currentTime = excerpt.start;
      return;
    }
    if (video.currentTime >= excerpt.end) {
      if (onEnded) {
        completed = true;
        onEnded();
      } else video.currentTime = excerpt.start;
    } else {
      const black = excerpt.skipRanges?.find(range => video.currentTime >= range.start && video.currentTime < range.end);
      if (black) video.currentTime = black.end;
    }
  };
  const watchFrame = () => {
    checkEnd();
    if (!disposed && !completed && video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(watchFrame);
  };
  if (video.readyState) seekToMiddle();
  video.addEventListener("loadedmetadata", seekToMiddle);
  video.addEventListener("timeupdate", checkEnd);
  if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(watchFrame);
  return () => {
    disposed = true;
    video.removeEventListener("loadedmetadata", seekToMiddle);
    video.removeEventListener("timeupdate", checkEnd);
    if (frame != null) video.cancelVideoFrameCallback?.(frame);
  };
}
