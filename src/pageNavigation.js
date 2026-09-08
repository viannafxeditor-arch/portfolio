export const pageFromPath = path => /^\/cinematic\/?$/.test(path) ? "cinematic" : "portfolio";
export const pathForPage = page => page === "cinematic" ? "/cinematic" : "/";

// Page content changes only after the curtain is fully black.
export function runPageTransition({ swap, reveal, finish }, clock = globalThis) {
  const timers = [clock.setTimeout(swap, 1500), clock.setTimeout(reveal, 2700), clock.setTimeout(finish, 4200)];
  return () => timers.forEach(timer => clock.clearTimeout(timer));
}
