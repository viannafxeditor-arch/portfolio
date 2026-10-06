import { useCallback, useRef, useState } from "react";
import { PiCaretDownThin } from "react-icons/pi";
import { cinematicClips, cinematicGames, cinematicCopy } from "../cinematicData.js";
import { PortfolioBackdrop } from "./PortfolioBackdrop.jsx";
import { useSectionTransitions } from "../hooks/useSectionTransitions.js";
import { processClips } from "../cinematicProcess.js";
import { ClosingSections } from "./ClosingSections.jsx";
import { GameLibrary } from "./GameLibrary.jsx";
import { CinematicProcess } from "./CinematicProcess.jsx";
import { WorkSection } from "./WorkSection.jsx";

export function CinematicPage({ language, copy, paused, onPlay }) {
  const pageRef = useRef(null);
  useSectionTransitions(pageRef);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const heroRef = useRef(null);
  const [selection, setSelection] = useState(0);
  const [gameId, setGameId] = useState(cinematicGames[0].id);
  const game = cinematicGames.find(item => item.id === gameId) || cinematicGames[0];
  const labels = cinematicCopy[language];
  const gameSection = { id: "games", projects: game.clips, gameId: game.id };
  const gameCopy = { ...copy, work: { games: { title: game.title } } };
  const [backgrounds, setBackgrounds] = useState(() => ({
    games: { project: cinematicGames[0].clips[0] },
    process: { project: processClips[cinematicGames[0].id][0] },
  }));
  const updateBackground = useCallback((id, project, onEnded) => {
    setBackgrounds(current => current[id]?.project === project && current[id]?.onEnded === onEnded
      ? current : { ...current, [id]: { project, onEnded } });
  }, []);

  const controls = <div className="cinematic-controls">
    <button className="game-picker" type="button" data-game-picker aria-haspopup="dialog" onClick={() => setLibraryOpen(true)}><span><small>{labels.choose}</small><strong>{game.title}</strong></span><PiCaretDownThin aria-hidden="true" /></button>
  </div>;

  function advance() {
    setSelection(current => (current + 1) % cinematicClips.length);
  }

  const scenes = [
    { id: "home", project: cinematicClips[selection], onEnded: advance, cinematic: true },
    { id: "games", ...backgrounds.games, cinematic: true },
    { id: "process", ...backgrounds.process, cinematic: true },
  ];
  return <div ref={pageRef} className="portfolio-page cinematic-page">
    <PortfolioBackdrop scenes={scenes} paused={paused || libraryOpen} />
    <section ref={heroRef} id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label="Cinematic" tabIndex={-1}>Cinematic</h1>
    </section>
    <WorkSection section={gameSection} collectionKey={game.id} copy={gameCopy} cinemaOpen={paused || libraryOpen} onPlay={onPlay} railHeader={controls} onBackgroundChange={updateBackground} />
    <CinematicProcess game={game} language={language} paused={paused || libraryOpen} onBackgroundChange={updateBackground} />
    {libraryOpen && <GameLibrary gameId={game.id} labels={labels} onClose={() => setLibraryOpen(false)} onSelect={id => { setGameId(id); setLibraryOpen(false); }} />}
    <ClosingSections copy={copy} />
  </div>;
}
