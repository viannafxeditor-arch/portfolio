import { useEffect, useRef, useState } from "react";
import { YouTubeVideo } from "./YouTubeVideo.jsx";

export function YouTubeCinema({ project, copy, onClose }) {
  const dialog = useRef(null);
  const timer = useRef(null);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const previous = project.triggerElement || document.activeElement;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const element = dialog.current;
    element.showModal();
    return () => {
      clearTimeout(timer.current);
      element.close();
      document.documentElement.style.overflow = overflow;
      requestAnimationFrame(() => previous?.focus({ preventScroll: true }));
    };
  }, []);
  function close() {
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(onClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
  }
  return <dialog ref={dialog} className={`cinema${closing ? " is-closing" : ""}`} aria-label={project.title}
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="cinema__window cinema__window--youtube">
      <button className="cinema__accessible-close" type="button" onClick={close} autoFocus>{copy.close}</button>
      <div className="cinema__screen"><YouTubeVideo project={project} copy={copy} active={!closing} /></div>
    </div>
  </dialog>;
}
