import { useEffect, useRef, useState } from "react";
import { PiArrowDownThin } from "react-icons/pi";
import { ClosingSections } from "./ClosingSections.jsx";
import { WorkSection } from "./WorkSection.jsx";
import { usePreviewVideo } from "../hooks/usePreviewVideo.js";
import { workSections } from "../siteData.js";

export function PortfolioPage({ copy, paused, onPlay }) {
  const [format, setFormat] = useState("long-form");
  const [formatPhase, setFormatPhase] = useState("");
  const formatTimers = useRef([]);
  useEffect(() => () => formatTimers.current.forEach(clearTimeout), []);
  function changeFormat(next) {
    if (next === format && !formatPhase) return;
    formatTimers.current.forEach(clearTimeout);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setFormat(next); setFormatPhase(""); return; }
    setFormatPhase("out");
    formatTimers.current = [setTimeout(() => {
      setFormat(next);
      setFormatPhase("in");
      formatTimers.current.push(setTimeout(() => setFormatPhase(""), 220));
    }, 120)];
  }
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const baked = usePreviewVideo(heroRef, videoRef, { videoSrc: "/media/home-loop.mp4" }, paused);
  return <>
    <section ref={heroRef} id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <video ref={videoRef} className={`hero__poster${baked ? " is-baked-preview" : ""}`} poster="/media/home-frame.jpg" loop muted playsInline preload="none" aria-hidden="true" />
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label={copy.hero.title} tabIndex={-1}>{copy.hero.title}</h1>
      <a className="scroll-cue" href="#youtube" aria-label={copy.accessibility.scrollToWork}><PiArrowDownThin aria-hidden="true" /><span>{copy.hero.scroll}</span></a>
    </section>
    {workSections.map(section => <WorkSection key={section.id}
      section={section.id === "youtube" ? { ...section, projects: section.projects.filter(project => project.format === format) } : section}
      copy={copy} cinemaOpen={paused} onPlay={onPlay}
      collectionKey={section.id === "youtube" ? format : section.id}
      transitionPhase={section.id === "youtube" ? formatPhase : ""}
      horizontal={section.id === "youtube" && format === "shorts"}
      railHeader={section.id === "youtube" && <div className="format-selector" role="group" aria-label={copy.library.format}>
        {[['long-form', 'Long-Form'], ['shorts', 'Shorts']].map(([value, label]) => <button type="button" key={value} aria-pressed={format === value} onClick={() => changeFormat(value)}>{label}</button>)}
      </div>} />)}
    <ClosingSections copy={copy} />
  </>;
}
