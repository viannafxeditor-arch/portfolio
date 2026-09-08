import backgrounds from "./backgroundMedia.json" with { type: "json" };
import excerpts from "./cinematicExcerpts.json" with { type: "json" };
import visibility from "./backgroundVisibility.json" with { type: "json" };
import { cinematicWindow } from "./cinematicFade.js";
import { visiblePreviewRange } from "./previewTimeline.js";

const timelines = Object.fromEntries(Object.entries(backgrounds).map(([source, media]) => [source,
  visiblePreviewRange(media.duration, visibility[source]?.scannedSrc === media.variants[0].src ? visibility[source].ranges : [], media.excerpt ? cinematicWindow(media) : undefined)]));

export function selectBackgroundMedia(source, pixelWidth = 1920, pixelHeight = 0) {
  const media = backgrounds[source];
  if (!media) return { src: source, excerpt: excerpts[source], baked: false, playbackRate: excerpts[source] ? 1 : .8 };
  const variants = media.variants;
  // Cover can enlarge a landscape clip by its height on a tall display.
  const variant = variants.find(item => item.width >= pixelWidth && item.height >= pixelHeight) || variants.at(-1);
  return { src: timelines[source]?.unavailable ? undefined : variant.src, excerpt: timelines[source], baked: true, playbackRate: media.excerpt ? 1 : .8 };
}
