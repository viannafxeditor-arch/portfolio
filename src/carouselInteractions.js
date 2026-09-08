export const isCarouselTarget = target => Boolean(target?.closest?.(".project-carousel, .rail-control"));

export function bindCarouselWheel(rail, { move, isMoving, horizontal = false, now = () => performance.now(), pageSize = () => window.innerHeight }) {
  let total = 0, last = 0;
  const wheel = event => {
    if (event.ctrlKey || !isCarouselTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    const time = now();
    if (time - last > 180) total = 0;
    last = time;
    if (isMoving()) { total = 0; return; }
    const delta = horizontal && Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    total += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageSize() : 1);
    if (Math.abs(total) >= 28) { move(total > 0 ? "down" : "up"); total = 0; }
  };
  rail.addEventListener("wheel", wheel, { passive: false });
  return () => rail.removeEventListener("wheel", wheel);
}

export function hoveredProject(rail, point, surface = document) {
  if (!point) return null;
  const card = surface.elementFromPoint(point.x, point.y)?.closest("[data-project-id]");
  return card && rail?.contains(card) && card.getAttribute("aria-hidden") !== "true" ? card.dataset.projectId : null;
}
