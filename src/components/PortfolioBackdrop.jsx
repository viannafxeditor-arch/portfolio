import { useLayoutEffect, useRef } from "react";
import { usePreviewVideo } from "../hooks/usePreviewVideo.js";
import { videoPresentationProps } from "../videoPresentation.js";
import { CinematicBackground } from "./CinematicBackground.jsx";

function CinematicScene({ id, project, paused, onEnded }) {
  const sectionRef = useRef(null);
  useLayoutEffect(() => { sectionRef.current = document.getElementById(id); }, [id]);
  return <div data-scene={id} className="portfolio-scene">
    <CinematicBackground clip={project} paused={paused} containerRef={sectionRef} onEnded={onEnded} visibilityThreshold={.01} />
  </div>;
}

function Scene({ id, project, paused, shorts }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  useLayoutEffect(() => { sectionRef.current = document.getElementById(id); }, [id]);
  const baked = usePreviewVideo(sectionRef, videoRef, project, paused, undefined, false, .01);
  return <div data-scene={id} className={`portfolio-scene${shorts ? " portfolio-scene--shorts" : ""}`}>
    <video {...videoPresentationProps} ref={videoRef} className={baked ? "is-baked-preview" : ""}
      poster={project.poster} loop muted playsInline preload="none" />
  </div>;
}

export function PortfolioBackdrop({ scenes, paused }) {
  return <div className="portfolio-backdrop" aria-hidden="true">
    {scenes.map(scene => scene.cinematic
      ? <CinematicScene key={scene.id} {...scene} paused={paused} />
      : <Scene key={scene.id} {...scene} paused={paused} />)}
    <div data-scene="closing" className="portfolio-scene portfolio-scene--closing">
      <img src="/media/andreas-portrait.png" alt="" />
    </div>
    <div className="portfolio-backdrop__shade" />
  </div>;
}
