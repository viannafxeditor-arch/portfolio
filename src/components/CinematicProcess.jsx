import { useRef, useState } from "react";
import { CinematicBackground } from "./CinematicBackground.jsx";
import { processClips, processCopy } from "../cinematicProcess.js";

export function CinematicProcess({ game, language, paused }) {
  const sectionRef = useRef(null);
  const [selection, setSelection] = useState({ game: game.id, index: 0 });
  if (selection.game !== game.id) setSelection({ game: game.id, index: 0 });
  const clips = processClips[game.id];
  const index = selection.game === game.id ? selection.index : 0;
  const copy = processCopy[language];
  const advance = () => setSelection(current => ({ game: game.id, index: ((current.game === game.id ? current.index : 0) + 1) % clips.length }));

  return <section id="process" ref={sectionRef} className="work-section process-section" data-game={game.id} aria-labelledby="process-title">
    <CinematicBackground key={game.id} clip={clips[index]} paused={paused} containerRef={sectionRef} onEnded={advance} />
    <div className="process-section__shade" aria-hidden="true" />
    <div className="process-copy" tabIndex={0} role="region" aria-labelledby="process-title">
      <h2 id="process-title">{copy.heading}</h2>
      {copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
  </section>;
}
