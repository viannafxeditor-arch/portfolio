import { useRef, useState } from "react";
import { PiArrowDownThin, PiCaretDownThin } from "react-icons/pi";
import { cinematicClips, cinematicGames, cinematicCopy } from "../cinematicData.js";
import { CinematicBackground } from "./CinematicBackground.jsx";
import { ClosingSections } from "./ClosingSections.jsx";
import { GameLibrary } from "./GameLibrary.jsx";
import { CinematicProcess } from "./CinematicProcess.jsx";
import { WorkSection } from "./WorkSection.jsx";

export function CinematicPage({ language, copy, paused, onPlay }) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const heroRef = useRef(null);
  const [selection, setSelection] = useState(0);
  const [gameId, setGameId] = useState(cinematicGames[0].id);
  const game = cinematicGames.find(item => item.id === gameId) || cinematicGames[0];
  const labels = cinematicCopy[language];
  const gameSection = { id: "games", projects: game.clips, gameId: game.id };
  const gameCopy = { ...copy, work: { games: { title: game.title } } };

  const controls = <div className="cinematic-controls">
    <button className="game-picker" type="button" data-game-picker aria-haspopup="dialog" onClick={() => setLibraryOpen(true)}><span><small>{labels.choose}</small><strong>{game.title}</strong></span><PiCaretDownThin aria-hidden="true" /></button>
  </div>;

  function advance() {
    setSelection(current => (current + 1) % cinematicClips.length);
  }

  return <>
    <section ref={heroRef} id="home" className="hero" aria-label={copy.accessibility.introduction}>
      <CinematicBackground clip={cinematicClips[selection]} containerRef={heroRef} paused={paused || libraryOpen} onEnded={advance} />
      <div className="edge-shade" aria-hidden="true" />
      <h1 className="hero-title" aria-label="Cinematic" tabIndex={-1}>Cinematic</h1>
      <a className="scroll-cue" href="#games" aria-label={copy.accessibility.scrollToWork}><PiArrowDownThin aria-hidden="true" /><span>{copy.hero.scroll}</span></a>
    </section>
    <WorkSection section={gameSection} collectionKey={game.id} copy={gameCopy} cinemaOpen={paused || libraryOpen} onPlay={onPlay} railHeader={controls} />
    <CinematicProcess game={game} language={language} paused={paused || libraryOpen} />
    {libraryOpen && <GameLibrary gameId={game.id} labels={labels} onClose={() => setLibraryOpen(false)} onSelect={id => { setGameId(id); setLibraryOpen(false); }} />}
    <ClosingSections copy={copy} />
  </>;
}
