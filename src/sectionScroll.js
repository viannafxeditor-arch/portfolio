export const SCROLL_DURATION = 1000;
export const easeOutCubic = value => 1 - (1 - Math.min(1, Math.max(0, value))) ** 3;

export function adjacentSection(stops, position, direction) {
  return direction > 0
    ? stops.find(stop => stop > position + 4) ?? stops.at(-1)
    : [...stops].reverse().find(stop => stop < position - 4) ?? stops[0];
}

export function scrollToSection(id) {
  window.dispatchEvent(new CustomEvent("vianna:scroll-section", { detail: id }));
}

// Time-based movement keeps the same gentle pacing on 60 Hz and 120 Hz screens.
export function animateSectionScroll({ from, to, write, finish, duration = SCROLL_DURATION, clock = window }) {
  let frame;
  let start;
  const step = time => {
    start ??= time;
    const progress = Math.min(1, (time - start) / duration);
    write(from + (to - from) * easeOutCubic(progress));
    if (progress < 1) frame = clock.requestAnimationFrame(step);
    else finish();
  };
  frame = clock.requestAnimationFrame(step);
  return () => clock.cancelAnimationFrame(frame);
}
