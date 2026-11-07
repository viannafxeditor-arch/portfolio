// Finish the background blend while the incoming section is still entering.
export function sceneOpacity(top, viewportHeight, reducedMotion = false) {
  const coverage = Math.max(0, Math.min(1, 1 - top / viewportHeight));
  if (reducedMotion) return Number(coverage >= .35);
  const progress = Math.min(1, coverage / .7);
  return progress * progress * (3 - 2 * progress);
}
