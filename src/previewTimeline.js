export function visiblePreviewRange(duration, ranges = [], excerpt) {
  if (!ranges.length) return excerpt;
  const padding = .09;
  // Loop before the media element wraps to frame zero and reveals a black intro.
  let start = 0, end = Math.max(0, duration - padding);
  for (const range of ranges) {
    if (range.start <= start + padding) start = Math.min(duration, range.end + padding);
  }
  for (const range of [...ranges].reverse()) {
    if (range.end >= end - padding) end = Math.max(0, range.start - padding);
  }
  if (end <= start) return { start: 0, end: 0, unavailable: true };
  if (excerpt) end = Math.min(end, start + excerpt.end - excerpt.start);
  return { ...excerpt, start, end, skipRanges: ranges.filter(range => range.start > start && range.end < end)
    .map(range => ({ start: Math.max(start, range.start - padding), end: Math.min(end, range.end + padding) })) };
}
