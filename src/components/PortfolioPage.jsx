import { useCallback, useRef, useState } from "react";
import { ClosingSections } from "./ClosingSections.jsx";
import { WorkSection } from "./WorkSection.jsx";
import { PortfolioBackdrop } from "./PortfolioBackdrop.jsx";
import { useSectionTransitions } from "../hooks/useSectionTransitions.js";
import { workSections } from "../siteData.js";

export function PortfolioPage({ copy, paused, onPlay }) {
  const pageRef = useRef(null);
  useSectionTransitions(pageRef);
  const [scenes, setScenes] = useState(() => [
    { id: "home", project: { videoSrc: "/media/trial-v2.mp4", poster: "/media/trial-v2-poster.jpg" } },
    ...workSections.map(section => ({ id: section.id, project: section.projects[0], shorts: section.format === "shorts" })),
  ]);
  const updateBackground = useCallback((id, project) => {
    setScenes(current => current.map(scene => scene.id === id && scene.project !== project ? { ...scene, project } : scene));
  }, []);
  return <div ref={pageRef} className="portfolio-page">
    <PortfolioBackdrop scenes={scenes} paused={paused} />
    <section id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label={copy.hero.title} tabIndex={-1}>{copy.hero.title}</h1>
    </section>
    {workSections.map(section => <WorkSection key={section.id}
      section={section} copy={copy} cinemaOpen={paused} onPlay={onPlay}
      horizontal={section.format === "shorts"} onBackgroundChange={updateBackground} />)}
    <ClosingSections copy={copy} />
  </div>;
}
