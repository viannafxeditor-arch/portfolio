import { videoPresentationProps } from "../videoPresentation.js";
import { useRef } from "react";
import { PiArrowDownThin } from "react-icons/pi";
import { ClosingSections } from "./ClosingSections.jsx";
import { WorkSection } from "./WorkSection.jsx";
import { usePreviewVideo } from "../hooks/usePreviewVideo.js";
import { workSections } from "../siteData.js";

export function PortfolioPage({ copy, paused, onPlay }) {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const baked = usePreviewVideo(heroRef, videoRef, { videoSrc: "/media/trial-v2.mp4" }, paused);
  return <>
    <section ref={heroRef} id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <video {...videoPresentationProps} ref={videoRef} className={`hero__poster${baked ? " is-baked-preview" : ""}`} poster="/media/trial-v2-poster.jpg" loop muted playsInline preload="none" aria-hidden="true" />
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label={copy.hero.title} tabIndex={-1}>{copy.hero.title}</h1>
      <a className="scroll-cue" href="#youtube" aria-label={copy.accessibility.scrollToWork}><PiArrowDownThin aria-hidden="true" /><span>{copy.hero.scroll}</span></a>
    </section>
    {workSections.map(section => <WorkSection key={section.id}
      section={section} copy={copy} cinemaOpen={paused} onPlay={onPlay}
      horizontal={section.format === "shorts"} />)}
    <ClosingSections copy={copy} />
  </>;
}
