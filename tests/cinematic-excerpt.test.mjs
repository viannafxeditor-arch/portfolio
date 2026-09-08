import assert from "node:assert/strict";
import test from "node:test";
import excerpts from "../src/cinematicExcerpts.json" with { type: "json" };
import { cinematicGames, cinematicClips } from "../src/cinematicData.js";
import { watchCinematicExcerpt } from "../src/cinematicExcerpt.js";

function fakeVideo() {
  const video = new EventTarget();
  Object.assign(video, { currentTime: 0, readyState: 1, seeking: false, pauseCount: 0,
    pause() { this.pauseCount++; },
    requestVideoFrameCallback(fn) { this.frame = fn; return 1; },
    cancelVideoFrameCallback() { this.frame = null; },
  });
  return video;
}

test("cinematic source ranges use the centered 3.5 seconds or the entire shorter clip", () => {
  for (const clip of [...cinematicClips, ...cinematicGames.flatMap(game => game.clips)]) {
    const range = excerpts[clip.videoSrc];
    assert.ok(range, clip.title);
    assert.ok(Math.abs(range.end - range.start - Math.min(3.5, range.sourceDuration)) < .00001);
    assert.ok(Math.abs(range.start + range.end - range.sourceDuration) < .00001);
    assert.ok(range.start >= 0 && range.end <= range.sourceDuration);
    assert.equal(clip.poster, range.poster);
  }
});

test("cinematic sequence advances once without pausing or rewinding the outgoing video", () => {
  const video = fakeVideo();
  let advances = 0;
  const stop = watchCinematicExcerpt(video, { start: 10, end: 13.5 }, { onEnded: () => advances++ });
  assert.equal(video.currentTime, 10);
  video.currentTime = 13.49;
  video.frame();
  assert.equal(advances, 0);
  video.currentTime = 13.5;
  video.frame();
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(advances, 1);
  assert.equal(video.pauseCount, 0);
  stop();
  const outgoing = watchCinematicExcerpt(video, { start: 10, end: 13.5 }, { outgoing: true });
  assert.equal(video.currentTime, 13.5);
  video.currentTime = 14.8;
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.currentTime, 14.8);
  assert.equal(video.pauseCount, 0);
  assert.equal(advances, 1);
  outgoing();
});

test("previews without an advance callback loop and cleanup stops all callbacks", () => {
  const video = fakeVideo();
  const stop = watchCinematicExcerpt(video, { start: 5, end: 7.5 });
  video.currentTime = 7.5;
  video.frame();
  assert.equal(video.currentTime, 5);
  assert.equal(video.pauseCount, 0);
  stop();
  video.currentTime = 10;
  video.dispatchEvent(new Event("timeupdate"));
  assert.equal(video.currentTime, 10);
  assert.equal(video.frame, null);
});
