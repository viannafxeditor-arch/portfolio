import { useEffect } from "react";
import { isCarouselTarget } from "../carouselInteractions.js";
import { adjacentSection, animateSectionScroll } from "../sectionScroll.js";

export function useSmoothSections(page, suspended) {
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancel = () => {};
    let moving = false;
    let lastWheel = 0;
    let wheelDelta = 0;
    let wheelSettling = false;
    let touch = null;
    const blocked = () => suspended || Boolean(document.querySelector("dialog[open]"));
    const readingOverflow = target => {
      const panel = target.closest?.(".process-copy");
      return panel && panel.scrollHeight > panel.clientHeight + 1;
    };
    const interactive = target => target instanceof Element && (readingOverflow(target) || Boolean(target.closest("dialog, input, select, textarea, button, [contenteditable=true], .game-library, .project-carousel")));
    const stops = () => [...new Set([...document.querySelectorAll("main .hero, main .work-section, main .closing, main .closing > div")]
      .filter(element => getComputedStyle(element).scrollSnapAlign !== "none")
      .map(element => Math.round(element.getBoundingClientRect().top + window.scrollY)))].sort((a, b) => a - b);
    const stop = () => {
      cancel();
      moving = false;
      root.classList.remove("is-section-scrolling");
    };
    const move = target => {
      if (target == null || blocked()) return;
      cancel();
      const to = Math.max(0, Math.min(target, root.scrollHeight - window.innerHeight));
      if (motion.matches || Math.abs(window.scrollY - to) < 1) {
        root.classList.add("is-section-scrolling");
        window.scrollTo({ top: to, behavior: "instant" });
        stop();
        return;
      }
      moving = true;
      root.classList.add("is-section-scrolling");
      cancel = animateSectionScroll({ from: window.scrollY, to,
        write: top => window.scrollTo({ top, behavior: "instant" }),
        finish: () => { moving = false; root.classList.remove("is-section-scrolling"); },
      });
    };
    const next = direction => move(adjacentSection(stops(), window.scrollY, direction));
    const wheel = event => {
      if (event.defaultPrevented || readingOverflow(event.target) || isCarouselTarget(event.target) || blocked() || event.ctrlKey || motion.matches || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      event.preventDefault();
      if (moving) { wheelDelta = 0; wheelSettling = true; return; }
      // A trackpad's trailing momentum must not immediately start another section.
      if (wheelSettling && gap <= 180) return;
      wheelSettling = false;
      if (gap > 180) wheelDelta = 0;
      wheelDelta += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(wheelDelta) >= 24) {
        next(Math.sign(wheelDelta));
        wheelDelta = 0;
      }
    };
    const keydown = event => {
      if (blocked() || interactive(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, " ": event.shiftKey ? -1 : 1 }[event.key];
      if (!direction && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      if (moving) return;
      if (event.key === "Home") move(stops()[0]);
      else if (event.key === "End") move(stops().at(-1));
      else next(direction);
    };
    const click = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || blocked()) return;
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      history.pushState({}, "", link.hash);
      move(target.getBoundingClientRect().top + window.scrollY);
    };
    const requested = event => {
      const target = document.getElementById(event.detail);
      if (target) move(target.getBoundingClientRect().top + window.scrollY);
    };
    const touchstart = event => {
      touch = !blocked() && !motion.matches && !interactive(event.target) && event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY, distance: 0 } : null;
    };
    const touchmove = event => {
      if (!touch || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - touch.x;
      const dy = touch.y - event.touches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy)) { touch = null; return; }
      if (Math.abs(dy) > 8) { event.preventDefault(); touch.distance = dy; }
    };
    const touchend = () => {
      if (touch && !moving && Math.abs(touch.distance) > 35) next(Math.sign(touch.distance));
      touch = null;
    };
    const touchcancel = () => { touch = null; };
    const resize = () => {
      if (!moving) return;
      stop();
      const nearest = stops().reduce((best, value) => Math.abs(value - window.scrollY) < Math.abs(best - window.scrollY) ? value : best, 0);
      window.scrollTo({ top: nearest, behavior: "instant" });
    };
    const visibility = () => { if (document.hidden && moving) resize(); };
    const observer = new MutationObserver(() => { if (blocked() && moving) stop(); });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    document.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("keydown", keydown);
    document.addEventListener("click", click);
    document.addEventListener("touchstart", touchstart, { passive: true });
    document.addEventListener("touchmove", touchmove, { passive: false });
    document.addEventListener("touchend", touchend);
    document.addEventListener("touchcancel", touchcancel);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("vianna:scroll-section", requested);
    window.addEventListener("resize", resize);
    motion.addEventListener("change", resize);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("wheel", wheel);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("click", click);
      document.removeEventListener("touchstart", touchstart);
      document.removeEventListener("touchmove", touchmove);
      document.removeEventListener("touchend", touchend);
      document.removeEventListener("touchcancel", touchcancel);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("vianna:scroll-section", requested);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", resize);
    };
  }, [page, suspended]);
}
