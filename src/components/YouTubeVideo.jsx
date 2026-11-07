import { createYouTubeVolumeRamp } from "../youtubeVolumeRamp.js";
import { useEffect, useRef, useState } from "react";
import { loadYouTubeAPI, youtubePlayerOptions } from "../youtubePlayer.js";

export function YouTubeVideo({ project, background = false, active = true, copy }) {
  const host = useRef(null);
  const player = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let ready = false;
    let instance;
    let volumeRamp;
    setStarted(false);
    setFailed(false);
    const sync = () => {
      if (!ready || disposed) return;
      if (document.hidden || !activeRef.current) { volumeRamp?.pause(); instance.pauseVideo(); }
      else { if (background) instance.mute(); instance.playVideo(); }
    };
    loadYouTubeAPI().then(YT => {
      if (disposed) return;
      const mount = document.createElement("div");
      host.current.append(mount);
      instance = new YT.Player(mount, {
        ...youtubePlayerOptions(project, background, window.location.origin),
        events: {
          onReady: event => {
            if (disposed) return;
            ready = true;
            const iframe = event.target.getIframe();
            iframe.title = project.title || "YouTube video";
            iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
            if (background) iframe.tabIndex = -1;
            if (!background) volumeRamp = createYouTubeVolumeRamp(event.target);
            sync();
          },
          onStateChange: event => {
            if (disposed) return;
            if (event.data !== 1) volumeRamp?.pause();
            if (event.data === 1) {
              if (document.hidden || !activeRef.current) { volumeRamp?.pause(); instance.pauseVideo(); }
              else { setStarted(true); volumeRamp?.start(); }
            }
          },
          onError: () => { if (!disposed) setFailed(true); },
        },
      });
      player.current = { sync };
    }).catch(() => { if (!disposed) setFailed(true); });
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", sync);
      player.current = null;
      volumeRamp?.destroy();
      instance?.destroy();
      host.current?.replaceChildren();
    };
  }, [project.youtubeId, project.startSeconds, background]);
  useEffect(() => { player.current?.sync(); }, [active]);
  return <div className={`youtube-video${background ? " youtube-video--background" : ""}${started ? " is-playing" : ""}${failed ? " has-error" : ""}`}>
    <img className="youtube-video__poster" src={project.poster} alt="" />
    <div ref={host} className="youtube-video__host" />
    {!background && failed && <div className="cinema__message" role="status"><p>{copy.error}</p>
      <a href={`https://www.youtube.com/watch?v=${project.youtubeId}&t=${project.startSeconds || 0}s`} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
    </div>}
  </div>;
}

export function YouTubeBackground({ id, project, paused }) {
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const section = document.getElementById(id);
    if (!section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(motion.matches);
    update();
    motion.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > .01), { threshold: [0, .01] });
    observer.observe(section);
    return () => { observer.disconnect(); motion.removeEventListener("change", update); };
  }, [id]);
  return <div data-scene={id} className="portfolio-scene portfolio-scene--youtube">
    {visible && !reduced
      ? <YouTubeVideo project={project} background active={!paused} />
      : <img src={project.poster} alt="" />}
  </div>;
}
