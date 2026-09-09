import { useEffect } from "react";

// Wheel, touch and keyboard scrolling are handled by the browser.
export function useSmoothSections(page, suspended) {
  useEffect(() => {
    const requested = event => {
      if (suspended || document.querySelector("dialog[open]")) return;
      document.getElementById(event.detail)?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    window.addEventListener("vianna:scroll-section", requested);
    return () => window.removeEventListener("vianna:scroll-section", requested);
  }, [page, suspended]);
}
