export function lockGameLibraryViewport(surface = document, viewport = window) {
  const root = surface.documentElement;
  const saved = { overflow: root.style.overflow, snap: root.style.scrollSnapType, top: viewport.scrollY };
  root.style.scrollSnapType = "none";
  root.style.overflow = "hidden";
  return () => {
    root.style.overflow = saved.overflow;
    const section = surface.getElementById("games");
    viewport.scrollTo({ top: section ? section.getBoundingClientRect().top + viewport.scrollY : saved.top, behavior: "instant" });
    surface.querySelector("[data-game-picker]")?.focus({ preventScroll: true });
    root.style.scrollSnapType = saved.snap;
  };
}
