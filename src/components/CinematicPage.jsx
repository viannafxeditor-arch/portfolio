import { useCallback, useRef, useState } from "react";
import { cinematicHome, cinematicGames } from "../cinematicData.js";
import { PortfolioBackdrop } from "./PortfolioBackdrop.jsx";
import { useSectionTransitions } from "../hooks/useSectionTransitions.js";
import { ClosingSections } from "./ClosingSections.jsx";
import { WorkSection } from "./WorkSection.jsx";

export function CinematicPage({ language, copy, paused, onPlay }) {
  const pageRef = useRef(null);
  useSectionTransitions(pageRef);
  const game = cinematicGames[0];
  const section = { id: "games", subtitle: "MINECRAFT", projects: game.clips };
  const sectionCopy = { ...copy, work: { ...copy.work, games: { title: "CINEMATICS" } } };
  const [backgrounds, setBackgrounds] = useState(() => ({
    games: { project: game.clips[0] },
  }));
  const updateBackground = useCallback((id, project, onEnded) => {
    setBackgrounds(current => current[id]?.project === project && current[id]?.onEnded === onEnded
      ? current : { ...current, [id]: { project, onEnded } });
  }, []);
  const scenes = [
    { id: "home", project: cinematicHome },
    { id: "games", project: backgrounds.games.project },
  ];
  return <div ref={pageRef} className="portfolio-page cinematic-page">
    <PortfolioBackdrop scenes={scenes} paused={paused} />
    <section id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label="Cinematic" tabIndex={-1}>Cinematic</h1>
    </section>
    <WorkSection section={section} copy={sectionCopy} cinemaOpen={paused} onPlay={onPlay} onBackgroundChange={updateBackground} />
    <ClosingSections copy={copy} />
  </div>;
}
