import { useEffect, useRef } from "react";
import { PiXThin } from "react-icons/pi";
import { lockGameLibraryViewport } from "../gameLibraryViewport.js";
import { cinematicGames } from "../cinematicData.js";

export function GameLibrary({ gameId, labels, onSelect, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const restoreViewport = lockGameLibraryViewport();
    dialog.showModal();
    return () => {
      dialog.close();
      restoreViewport();
    };
  }, []);
  return <dialog ref={dialogRef} className="game-library" data-game={gameId} aria-labelledby="game-library-title" onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="game-library__surface">
      <header><div><small>VIANNA · CINEMATIC</small><h2 id="game-library-title">{labels.games}</h2></div><button type="button" className="cinema__button" aria-label={labels.close} onClick={onClose}><PiXThin /></button></header>
      <div className="game-library__grid">
        {cinematicGames.map(game => <button className="game-card" data-game={game.id} type="button" key={game.id} aria-pressed={game.id === gameId} onClick={() => onSelect(game.id)}>
          <img src={game.cover} alt="" width="600" height="900" loading="lazy" decoding="async" />
          <span className="game-card__copy"><strong>{game.title}</strong><small>{String(game.clips.length).padStart(2, "0")} {labels.scenes.toLowerCase()}</small></span>
        </button>)}
      </div>
    </div>
  </dialog>;
}
