import test from "node:test";
import assert from "node:assert/strict";
import backgrounds from "../src/backgroundMedia.json" with { type: "json" };
import { cinematicGames } from "../src/cinematicData.js";
import { selectBackgroundMedia } from "../src/backgroundMedia.js";
import { cinematicFadeReducer, fadeDuration, guardCinematicBoundary } from "../src/cinematicFade.js";
import { watchCinematicExcerpt } from "../src/cinematicExcerpt.js";

test("every game's fades fit before the first encoded wrap, including the shortest clips", () => {
  let shortened = 0;
  for (const game of cinematicGames) for (const clip of game.clips) {
    const media = backgrounds[clip.videoSrc];
    const timeline = selectBackgroundMedia(clip.videoSrc).excerpt;
    const firstWrap = Math.min(media.duration, media.sourceDuration - media.sourceStart);
    assert.ok(timeline.safeEnd < firstWrap, clip.id);
    assert.ok(timeline.end + timeline.fadeSeconds + .44 < firstWrap, clip.id);
    assert.ok(timeline.end > timeline.start && timeline.end <= 3.5, clip.id);
    if (timeline.end < 3.5) shortened++;
    // Include normal decoder startup before calculating the real overlap.
    const remaining = timeline.safeEnd - timeline.end - .3;
    const duration = fadeDuration(remaining, 2, timeline.fadeSeconds);
    assert.ok(duration > 0 && duration / 1000 < remaining, clip.id);
  }
  assert.ok(shortened >= 4);
});

test("rapid hovering preserves the base and finishes a fade before the latest selection", () => {
  const [a, b, c, d] = ["a", "b", "c", "d"].map(id => ({ id }));
  let state = { base: a, incoming: null, phase: "idle" };
  state = cinematicFadeReducer(state, { type: "request", clip: b });
  state = cinematicFadeReducer(state, { type: "request", clip: c });
  assert.equal(state.base, a);
  assert.equal(state.incoming, c);
  assert.equal(cinematicFadeReducer(state, { type: "ready", id: "b", duration: 800 }), state);
  state = cinematicFadeReducer(state, { type: "ready", id: "c", duration: 800 });
  assert.equal(state.phase, "fading");
  assert.equal(cinematicFadeReducer(state, { type: "request", clip: d }), state);
  assert.equal(cinematicFadeReducer(state, { type: "request", clip: a }), state);
  assert.equal(cinematicFadeReducer(state, { type: "finish", id: "b" }), state);
  state = cinematicFadeReducer(state, { type: "finish", id: "c" });
  assert.equal(state.base, c);
  state = cinematicFadeReducer(state, { type: "request", clip: d });
  assert.equal(state.base, c);
  assert.equal(state.incoming, d);
  assert.equal(state.phase, "loading");
});

test("a delayed load cannot expose a loop or erase its fade", () => {
  const video = new EventTarget();
  Object.assign(video, { currentTime: 1.9, paused: false, seeking: false, pause() { this.paused = true; } });
  const stop = guardCinematicBoundary(video, 2);
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.paused, false);
  video.currentTime = 2.01;
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 2.01); // Never seek back to the first frame.
  assert.ok(fadeDuration(0, 2) >= 160);
  stop();
});

test("promoting an incoming clip after its excerpt deadline advances without rewinding", () => {
  const video = new EventTarget();
  Object.assign(video, { currentTime: 2, readyState: 1, seeking: false });
  let advances = 0;
  const stop = watchCinematicExcerpt(video, { start: 0, end: 1.8 }, { onEnded() { advances++; } });
  assert.equal(video.currentTime, 2);
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(advances, 1);
  assert.equal(video.currentTime, 2);
  stop();
});
