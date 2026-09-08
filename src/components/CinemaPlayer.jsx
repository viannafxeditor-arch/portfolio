import { useCallback, useEffect, useRef, useState } from "react";
import { PiPlayFill, PiPauseFill, PiXThin, PiSpeakerHighThin, PiSpeakerSlashThin, PiCornersOutThin } from "react-icons/pi";
import videoQualities from "../videoQualities.json";
import { INITIAL_VIDEO_VOLUME, clampSeek, formatTime, fullscreenVideoLayout, createIdleCountdown } from "../mediaControls.js";

export function CinemaPlayer({ project, copy, onClose }) {
  const dialogRef = useRef(null);
  const windowRef = useRef(null);
  const videoRef = useRef(null);
  const attachVideo = useCallback((video) => {
    videoRef.current = video;
    if (video) video.volume = INITIAL_VIDEO_VOLUME;
  }, []);
  const closeTimer = useRef(null);
  const resumeRef = useRef({ time: 0, playing: true });
  const qualities = [...(videoQualities[project.videoSrc] || [])].sort((a, b) => b.height - a.height);
  const [source, setSource] = useState(project.videoSrc);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(INITIAL_VIDEO_VOLUME);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(Boolean(source));
  const [error, setError] = useState(false);
  const [closing, setClosing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const previousFocus = project.triggerElement || document.activeElement;
    const dialog = dialogRef.current;
    const video = videoRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    if (video && !video.getAttribute("src") && source) video.src = source;
    // Request playback while the opening click still grants user activation.
    videoRef.current?.play().catch(() => setPlaying(false));
    const trackFullscreen = () => setFullscreen(document.fullscreenElement === windowRef.current);
    document.addEventListener("fullscreenchange", trackFullscreen);
    return () => {
      window.clearTimeout(closeTimer.current);
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("fullscreenchange", trackFullscreen);
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      requestAnimationFrame(() => previousFocus?.focus({ preventScroll: true }));
    };
  }, []);

  useEffect(() => {
    if (!fullscreen) {
      setControlsHidden(false);
      setImmersive(false);
      return;
    }
    const surface = windowRef.current;
    const measure = () => {
      const video = videoRef.current;
      const chromeHeight = surface.querySelector(".cinema__heading").offsetHeight + surface.querySelector(".cinema__controls").offsetHeight + 32;
      const ratio = video.videoWidth / video.videoHeight;
      const layout = fullscreenVideoLayout(surface.clientWidth, surface.clientHeight, ratio, chromeHeight, ratio < 1 ? "contain" : "cover");
      surface.style.setProperty("--cinema-fit-width", `${layout.width}px`);
      surface.style.setProperty("--cinema-fit-height", `${layout.height}px`);
      surface.style.setProperty("--cinema-fill-scale", layout.scale);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    videoRef.current.addEventListener("loadedmetadata", measure);
    return () => {
      observer.disconnect();
      videoRef.current?.removeEventListener("loadedmetadata", measure);
    };
  }, [fullscreen]);

  useEffect(() => {
    setControlsHidden(false);
    if (!fullscreen || !playing || loading || error || closing) return;
    const surface = windowRef.current;
    let keyboardActive = false;
    let selecting = false;
    const idle = createIdleCountdown(() => {
      if (selecting || (keyboardActive && surface.contains(document.activeElement))) return;
      // Move focus before making faded controls inert.
      surface.focus({ preventScroll: true });
      setControlsHidden(true);
      setImmersive(true);
    });
    const reveal = event => {
      if (event.type === "keydown") keyboardActive = true;
      else if (event.type.startsWith("pointer")) keyboardActive = false;
      if (event.type === "pointerdown" && event.target.tagName === "SELECT") selecting = true;
      if (event.type === "change" || event.type === "focusout") selecting = false;
      setControlsHidden(false);
      idle.restart();
    };
    const events = ["pointermove", "pointerdown", "keydown", "change", "focusout"];
    events.forEach(event => surface.addEventListener(event, reveal));
    idle.restart();
    return () => { idle.cancel(); events.forEach(event => surface.removeEventListener(event, reveal)); };
  }, [fullscreen, playing, loading, error, closing]);

  function close() {
    if (closing) return;
    setClosing(true);
    videoRef.current?.pause();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    closeTimer.current = window.setTimeout(onClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video || error) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  function seek(value) {
    if (!videoRef.current || !duration) return;
    videoRef.current.currentTime = clampSeek(value, duration);
    setTime(videoRef.current.currentTime);
  }

  function changeQuality(next) {
    const video = videoRef.current;
    resumeRef.current = { time: video.currentTime, playing: !video.paused };
    setLoading(true);
    setError(false);
    setSource(next);
  }

  function loaded() {
    const video = videoRef.current;
    setDuration(video.duration);
    video.currentTime = clampSeek(resumeRef.current.time, video.duration);
    video.volume = volume;
    video.muted = muted;
    video.playbackRate = 1;
    setLoading(false);
    if (resumeRef.current.playing) video.play().catch(() => setPlaying(false));
  }

  function onKeyDown(event) {
    if (["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return;
    if (event.code === "Space" || event.key.toLowerCase() === "k") { event.preventDefault(); togglePlay(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); seek(time - 5); }
    if (event.key === "ArrowRight") { event.preventDefault(); seek(time + 5); }
  }

  return (
    <dialog ref={dialogRef} className={`cinema ${closing ? "is-closing" : ""}`} aria-labelledby="cinema-title"
      onCancel={event => { event.preventDefault(); close(); }} onKeyDown={onKeyDown}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div ref={windowRef} tabIndex={-1} className={`cinema__window ${project.orientation === "portrait" ? "is-portrait" : ""} ${controlsHidden ? "is-controls-hidden" : ""} ${immersive ? "is-immersive" : ""}`}>
        <header className="cinema__heading" inert={controlsHidden ? true : undefined}>
          <h2 id="cinema-title">{project.title}</h2>
          <button className="cinema__button" type="button" aria-label={copy.close} onClick={close} autoFocus><PiXThin /></button>
        </header>
        <div className="cinema__screen">
          {source ? <video ref={attachVideo} src={source} poster={project.poster} playsInline preload="metadata"
            onLoadedMetadata={loaded} onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
            onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onPlaying={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }} onClick={togglePlay}
            onVolumeChange={event => { setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted); }}
            aria-label={project.title} /> : <img src={project.poster} alt="" />}
          {(!source || error) && <div className="cinema__message" role="status">
            <p>{error ? copy.error : copy.unavailable}</p>
            {error && <button type="button" onClick={() => { setError(false); setLoading(true); videoRef.current.load(); }}>{copy.retry}</button>}
          </div>}
          {source && loading && !error && <span className="cinema__loading" role="status">{copy.loading}</span>}
          {source && !playing && !loading && !error && <button className="cinema__big-play" type="button" aria-label={copy.play} onClick={togglePlay}><PiPlayFill /></button>}
        </div>
        {source && <div className="cinema__controls" inert={controlsHidden ? true : undefined}>
          <input className="cinema__seek" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(time, duration)}
            onChange={event => seek(Number(event.target.value))} aria-label={copy.seek} aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`} disabled={!duration || error} />
          <div className="cinema__toolbar">
            <button className="cinema__button" type="button" onClick={togglePlay} aria-label={playing ? copy.pause : copy.play} disabled={error}>{playing ? <PiPauseFill /> : <PiPlayFill />}</button>
            <button className="cinema__button cinema__skip" type="button" onClick={() => seek(time - 5)} aria-label={copy.back} disabled={!duration || error}>−5s</button>
            <button className="cinema__button cinema__skip" type="button" onClick={() => seek(time + 5)} aria-label={copy.forward} disabled={!duration || error}>+5s</button>
            <span className="cinema__time">{formatTime(time)} <span>/ {formatTime(duration)}</span></span>
            <div className="cinema__volume">
              <button className="cinema__button" type="button" aria-label={muted ? copy.unmute : copy.mute} onClick={() => { videoRef.current.muted = !muted; }}>{muted || volume === 0 ? <PiSpeakerSlashThin /> : <PiSpeakerHighThin />}</button>
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} aria-label={copy.volume}
                onChange={event => { videoRef.current.volume = Number(event.target.value); videoRef.current.muted = false; }} />
            </div>
            <label className="cinema__quality"><span>{copy.quality}</span>
              <select aria-label={copy.quality} value={source} onChange={event => changeQuality(event.target.value)}>
                {qualities.map(quality => <option key={quality.src} value={quality.src}>{quality.height}p · {Number(quality.fps.toFixed(2))} fps{quality.original ? ` · ${copy.original}` : ""}</option>)}
              </select>
            </label>
            <button className="cinema__button" type="button" aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen} onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
              else if (windowRef.current.requestFullscreen) windowRef.current.requestFullscreen().catch(() => {});
              else videoRef.current.webkitEnterFullscreen?.();
            }}><PiCornersOutThin /></button>
          </div>
        </div>}
      </div>
    </dialog>
  );
}
