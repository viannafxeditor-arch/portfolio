export const VISIBLE_COUNT = 3;
export const wrapIndex = (index, length) => length ? ((index % length) + length) % length : 0;

export function railSlots(projects, startIndex = 0) {
  if (projects.length <= VISIBLE_COUNT) return projects.map(project => ({ project, isPeek: false }));
  return Array.from({ length: VISIBLE_COUNT + 2 }, (_, position) => ({
    project: projects[wrapIndex(startIndex + position - 1, projects.length)],
    isPeek: position === 0 || position === VISIBLE_COUNT + 1,
  }));
}

// Keep the newly playing scene inside the three selectable cards.
export function nextRailPreview(projects, activeId, startIndex) {
  if (projects.length < 2) return null;
  const current = projects.findIndex(project => project.id === activeId);
  const index = wrapIndex(current + 1, projects.length);
  const visibleOffset = wrapIndex(index - startIndex, projects.length);
  return { project: projects[index], startIndex: projects.length <= VISIBLE_COUNT ? 0 : visibleOffset < VISIBLE_COUNT ? startIndex : index };
}
