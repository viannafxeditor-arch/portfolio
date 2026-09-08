import { useCallback, useEffect, useRef, useState } from "react";
import { pageFromPath, pathForPage, runPageTransition } from "../pageNavigation.js";
import { scrollToSection } from "../sectionScroll.js";

export function usePageNavigation(portfolioTitle) {
  const [page, setPage] = useState(() => typeof window === "undefined" ? "portfolio" : pageFromPath(window.location.pathname));
  const [transition, setTransition] = useState(null);
  const pageRef = useRef(page);
  const running = useRef(false);
  const cancelRef = useRef(() => {});
  const cleanupRef = useRef(() => {});

  const go = useCallback((target, hash = "", historyMode = "push") => {
    cancelRef.current();
    cleanupRef.current();
    cleanupRef.current = () => {};
    const from = pageRef.current;
    const scroll = () => {
      const id = hash.slice(1) || "home";
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    const commit = () => {
      if (historyMode === "push") window.history.pushState({}, "", pathForPage(target) + hash);
      pageRef.current = target;
      setPage(target);
    };
    if (from === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commit();
      running.current = false;
      setTransition(null);
      requestAnimationFrame(() => {
        if (from === target) {
          scrollToSection(hash.slice(1) || "home");
        } else scroll();
      });
      return;
    }
    running.current = true;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    cleanupRef.current = () => { root.style.overflow = previousOverflow; };
    const words = { from: from === "cinematic" ? "Cinematic" : portfolioTitle, to: target === "cinematic" ? "Cinematic" : portfolioTitle };
    setTransition({ ...words, phase: "cover" });
    cancelRef.current = runPageTransition({
      swap() {
        commit();
        setTransition({ ...words, phase: "swap" });
        requestAnimationFrame(scroll);
      },
      reveal() { setTransition({ ...words, phase: "reveal" }); },
      finish() {
        cleanupRef.current();
        cleanupRef.current = () => {};
        running.current = false;
        setTransition(null);
        requestAnimationFrame(() => {
          scroll();
          document.querySelector("#home h1")?.focus({ preventScroll: true });
        });
      },
    });
  }, [portfolioTitle]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const backForward = () => go(pageFromPath(window.location.pathname), window.location.hash, "none");
    window.addEventListener("popstate", backForward);
    return () => {
      window.removeEventListener("popstate", backForward);
      window.history.scrollRestoration = previousRestoration;
      cancelRef.current();
      cleanupRef.current();
    };
  }, [go]);

  function navigate(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(event.currentTarget.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    if (running.current) return;
    go(pageFromPath(url.pathname), url.hash);
  }
  return { page, transition, navigate };
}
