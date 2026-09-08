import test from "node:test";
import assert from "node:assert/strict";
import { bindCarouselWheel, hoveredProject } from "../src/carouselInteractions.js";
import { lockGameLibraryViewport } from "../src/gameLibraryViewport.js";
import { visiblePreviewRange } from "../src/previewTimeline.js";
import { selectBackgroundMedia } from "../src/backgroundMedia.js";
import { watchCinematicExcerpt } from "../src/cinematicExcerpt.js";
import { cinematicGames } from "../src/cinematicData.js";
import { workSections, projectDisplayTitle } from "../src/siteData.js";

test("wheel over thumbnails moves the carousel and consumes page scrolling, including during animation", () => {
  let listener, busy = false, clock = 0;
  const moves = [];
  const rail = { addEventListener(type, fn, options) { assert.equal(options.passive, false); listener = fn; }, removeEventListener() { listener = null; } };
  const unbind = bindCarouselWheel(rail, { move: direction => moves.push(direction), isMoving: () => busy, now: () => clock, horizontal: true });
  function wheel(dx, dy, inside = true, ctrlKey = false) {
    const event = { deltaX: dx, deltaY: dy, deltaMode: 0, ctrlKey, target: { closest: () => inside },
      preventDefault() { this.prevented = true; }, stopPropagation() { this.stopped = true; } };
    listener(event); clock += 30; return event;
  }
  assert.ok(wheel(0, 16).prevented);
  assert.ok(wheel(0, 16).stopped);
  assert.deepEqual(moves, ["down"]);
  busy = true;
  assert.ok(wheel(0, 100).prevented);
  assert.equal(moves.length, 1);
  busy = false;
  wheel(-60, 0);
  assert.deepEqual(moves, ["down", "up"]);
  assert.equal(wheel(0, 100, false).prevented, undefined);
  assert.equal(wheel(0, 100, true, true).prevented, undefined);
  unbind(); assert.equal(listener, null);
});

test("a stationary pointer selects the card newly revealed after a carousel move", () => {
  let id = "old", peek = false;
  const card = { dataset: {}, getAttribute: () => peek ? "true" : null };
  const surface = { elementFromPoint() { card.dataset.projectId = id; return { closest: () => card }; } };
  const rail = { contains: () => true };
  assert.equal(hoveredProject(rail, { x: 20, y: 30 }, surface), "old");
  id = "new";
  assert.equal(hoveredProject(rail, { x: 20, y: 30 }, surface), "new");
  peek = true;
  assert.equal(hoveredProject(rail, { x: 20, y: 30 }, surface), null);
});

test("closing game selection restores the scene viewport and focus without jumping to About", () => {
  let focus;
  const viewport = { scrollY: 900, scrollTo({ top }) { this.scrollY = top; } };
  const surface = { documentElement: { style: { overflow: "", scrollSnapType: "" } },
    getElementById: () => ({ getBoundingClientRect: () => ({ top: 900 - viewport.scrollY }) }),
    querySelector: () => ({ focus: options => { focus = options; } }) };
  const restore = lockGameLibraryViewport(surface, viewport);
  assert.equal(surface.documentElement.style.scrollSnapType, "none");
  viewport.scrollY = 1800;
  restore();
  assert.equal(viewport.scrollY, 900);
  assert.deepEqual(focus, { preventScroll: true });
  assert.equal(surface.documentElement.style.overflow, "");
  assert.equal(surface.documentElement.style.scrollSnapType, "");
});

test("background visibility trims black head/tail and skips internal black frames", () => {
  const range = visiblePreviewRange(30, [{ start: 0, end: 3 }, { start: 12, end: 13 }, { start: 28, end: 30 }]);
  assert.ok(range.start > 3 && range.end < 28);
  const video = new EventTarget();
  Object.assign(video, { currentTime: 0, readyState: 1, seeking: false });
  const stop = watchCinematicExcerpt(video, range);
  assert.equal(video.currentTime, range.start);
  video.currentTime = 12; video.dispatchEvent(new Event("timeupdate"));
  assert.ok(video.currentTime > 13);
  video.currentTime = 29; video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.currentTime, range.start);
  video.currentTime = 0; video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.currentTime, range.start);
  stop();
  assert.ok(visiblePreviewRange(5, [{ start: 0, end: 5 }]).unavailable);
  const contentWarning = selectBackgroundMedia("/media/content-warning-loop.mp4");
  assert.ok(contentWarning.excerpt.start >= 3);
  assert.ok(contentWarning.excerpt.end < 30);
  assert.equal(contentWarning.playbackRate, .8);
});

test("only supplied games remain and every collection is numbered consecutively", () => {
  assert.deepEqual(cinematicGames.map(game => game.title), ["Cyberpunk", "Red Dead Redemption 2", "Fallout 4", "Fallout 76"]);
  assert.deepEqual(workSections.map(section => section.id), ["youtube", "documentary"]);
  const youtube = workSections[0].projects;
  const collections = [...cinematicGames.map(game => game.clips), youtube.filter(clip => clip.format === "long-form"), youtube.filter(clip => clip.format === "shorts"), workSections[1].projects];
  for (const clips of collections) clips.forEach((clip, index) => {
    assert.equal(clip.sequence, index + 1);
    assert.ok(projectDisplayTitle(clip).endsWith(String(index + 1).padStart(2, "0")));
    assert.ok(clip.sourceFilename);
  });
});
