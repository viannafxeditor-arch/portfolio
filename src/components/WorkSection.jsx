import { videoPresentationProps } from "../videoPresentation.js";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PiCaretDownThin, PiCaretUpThin, PiCaretLeftThin, PiCaretRightThin, PiPlayFill } from "react-icons/pi";
import { usePreviewVideo } from "../hooks/usePreviewVideo.js";
import { projectDisplayTitle } from "../siteData.js";
import { CinematicBackground } from "./CinematicBackground.jsx";
import { nextRailPreview } from "../projectRail.js";
import { VISIBLE_COUNT, wrapIndex, railSlots } from "../projectRail.js";
import thumbnails from "../mediaThumbnails.json";

import { bindCarouselWheel, hoveredProject } from "../carouselInteractions.js";

const RAIL_TRANSITION_MS = 420;

export function WorkSection({ section, copy, cinemaOpen, onPlay, railHeader, horizontal = false, collectionKey = section.id, transitionPhase = "" }) {
  const [activeId, setActiveId] = useState(section.projects[0]?.id);
  const [startIndex, setStartIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [railMotion, setRailMotion] = useState(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const railTimerRef = useRef(null);
  const swipeRef = useRef(null);
  const railRef = useRef(null);
  const pointerRef = useRef(null);
  const motionRef = useRef(false);
  const moveRef = useRef(null);
  const selections = useRef({});

  function selectProject(id) {
    selections.current[collectionKey] = id;
    setActiveId(id);
  }

  useLayoutEffect(() => {
    window.clearTimeout(railTimerRef.current);
    motionRef.current = false;
    setRailMotion(null);
    setStartIndex(0);
    setActiveId(selections.current[collectionKey] || section.projects[0]?.id);
  }, [collectionKey]);

  // Hit-test again after moving cards settle, including a stationary pointer.
  useLayoutEffect(() => {
    if (railMotion || !pointerRef.current) return;
    const frame = requestAnimationFrame(() => {
      const point = pointerRef.current;
      if (!point) return;
      const id = hoveredProject(railRef.current, point);
      if (id) selectProject(id);
    });
    return () => cancelAnimationFrame(frame);
  }, [startIndex, railMotion, collectionKey]);

  const activeProject = useMemo(
    () => section.projects.find((project) => project.id === activeId) ?? section.projects[0],
    [activeId, section.projects],
  );
  const carouselProjects = useMemo(
    () => railSlots(section.projects, startIndex),
    [section.projects, startIndex],
  );
  const sectionCopy = copy.work[section.id];
  const scrollable = section.projects.length > VISIBLE_COUNT;

  const cinematic = section.id === "games";
  const baked = usePreviewVideo(sectionRef, videoRef, cinematic ? undefined : activeProject, cinemaOpen);

  function advancePreview() {
    const next = nextRailPreview(section.projects, activeProject?.id, startIndex);
    if (!next) return;
    // Automatic progression must not reselect the old card beneath a stationary pointer.
    pointerRef.current = null;
    window.clearTimeout(railTimerRef.current);
    motionRef.current = false;
    setRailMotion(null);
    setStartIndex(next.startIndex);
    selectProject(next.project.id);
  }
  useEffect(() => () => window.clearTimeout(railTimerRef.current), []);

  useEffect(() => {
    setTransitioning(true);
    const timer = window.setTimeout(() => setTransitioning(false), 360);
    return () => window.clearTimeout(timer);
  }, [activeId]);

  function moveRail(direction) {
    if (motionRef.current || !scrollable) return;
    motionRef.current = true;
    setRailMotion(direction);
    railTimerRef.current = window.setTimeout(() => {
      setStartIndex((current) => wrapIndex(current + (direction === "down" ? 1 : -1), section.projects.length));
      motionRef.current = false;
      setRailMotion(null);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : RAIL_TRANSITION_MS);
  }

  moveRef.current = moveRail;
  useEffect(() => {
    return bindCarouselWheel(railRef.current, { move: direction => moveRef.current(direction), isMoving: () => motionRef.current, horizontal });
  }, [horizontal, collectionKey]);

  function startSwipe(event) {
    if (horizontal && event.touches.length === 1) swipeRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function finishSwipe(event) {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || !event.changedTouches.length || !scrollable) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      event.preventDefault();
      moveRail(dx < 0 ? "down" : "up");
    }
  }

  return (
    <section ref={sectionRef} id={section.id} data-game={section.gameId} data-format-transition={transitionPhase || undefined} className={`work-section${horizontal ? " work-section--shorts" : ""}`} aria-labelledby={`${section.id}-title`}>
      {cinematic && activeProject ? <CinematicBackground clip={activeProject} paused={cinemaOpen} containerRef={sectionRef} onEnded={advancePreview} /> : activeProject?.videoSrc && (
        <video {...videoPresentationProps}
          ref={videoRef}
          key={activeProject.videoSrc}
          className={`work-section__poster ${transitioning ? "is-transitioning" : ""}${baked ? " is-baked-preview" : ""}`}
          poster={activeProject.poster}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
      <div className="work-section__shade" aria-hidden="true" />

      <div className="work-copy reveal-copy">
        <h2 id={`${section.id}-title`}>{sectionCopy.title}</h2>
      </div>

      <aside ref={railRef}
        onPointerMove={event => { if (event.pointerType === "mouse") pointerRef.current = { x: event.clientX, y: event.clientY }; }}
        onPointerLeave={() => { pointerRef.current = null; }} className={`project-rail${horizontal ? " project-rail--horizontal" : ""}`} aria-label={`${sectionCopy.title} ${copy.accessibility.projects}`}>
        <div className="project-rail__backdrop" aria-hidden="true" />
        {railHeader}
        {scrollable && <button
          className="rail-control rail-control--previous"
          type="button"
          onClick={() => moveRail("up")}
          disabled={Boolean(railMotion)}
          aria-label={`${copy.accessibility.returnFirst} ${sectionCopy.title} ${copy.accessibility.projects}`}
        >
          {horizontal ? <PiCaretLeftThin aria-hidden="true" /> : <PiCaretUpThin aria-hidden="true" />}
        </button>}

        {!section.projects.length && <p className="library-empty" role="status">{copy.library.empty}</p>}
        <div className={`project-carousel ${!scrollable ? "is-static" : ""}`} aria-live="polite"
          onTouchStart={startSwipe} onTouchEnd={finishSwipe} onTouchCancel={() => { swipeRef.current = null; }}
          onKeyDown={event => {
            const keys = horizontal ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
            if (!scrollable || !keys.includes(event.key)) return;
            event.preventDefault();
            moveRail(event.key === keys[1] ? "down" : "up");
          }}>
          <div className={`project-rail__list ${railMotion ? `is-moving-${railMotion}` : ""}`}>
            {carouselProjects.map(({ project, isPeek }, position) => {
              const selected = project.id === activeId;
              const projectTitle = projectDisplayTitle(project, project.title);
              const projectType = section.id === "youtube" ? "Gameplay" : section.id === "games" ? "Cinematic" : sectionCopy.title;
              return (
                <button
                  key={`${project.id}-${position}`}
                  data-project-id={project.id}
                  className={`project-item ${project.orientation === "portrait" ? "is-portrait" : ""} ${selected ? "is-active" : ""} ${isPeek ? "is-peek" : ""}`}
                  type="button"
                  onPointerEnter={event => { if (!isPeek && event.pointerType === "mouse") selectProject(project.id); }}
                  onPointerMove={event => { if (!isPeek && event.pointerType === "mouse") selectProject(project.id); }}
                  onFocus={() => { if (!isPeek) selectProject(project.id); }}
                  onClick={(event) => {
                    selectProject(project.id);
                    onPlay({ ...project, title: projectTitle, triggerElement: event.currentTarget });
                  }}
                  tabIndex={isPeek ? -1 : 0}
                  aria-hidden={isPeek || undefined}
                  aria-pressed={selected}
                  aria-label={`${copy.accessibility.play} ${projectTitle}`}
                >
                  <span className="project-item__thumb">
                    <img src={thumbnails[project.thumb] || project.thumb} alt="" loading="lazy" decoding="async" width={project.orientation === "portrait" ? 360 : 640} height={project.orientation === "portrait" ? 640 : 360} />
                    <PiPlayFill aria-hidden="true" />
                  </span>
                  <span className="project-item__meta">
                    <strong>{projectTitle}</strong>
                    <small>{projectType}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {scrollable && <button
          className="rail-control rail-control--next"
          type="button"
          onClick={() => moveRail("down")}
          disabled={Boolean(railMotion)}
          aria-label={`${copy.accessibility.showMore} ${sectionCopy.title} ${copy.accessibility.projects}`}
        >
          {horizontal ? <PiCaretRightThin aria-hidden="true" /> : <PiCaretDownThin aria-hidden="true" />}
        </button>}
      </aside>
    </section>
  );
}
