import assert from "node:assert/strict";
import test from "node:test";
import { createBackgroundPlayback, BACKGROUND_START_MS, BACKGROUND_RELEASE_MS } from "../src/backgroundPlayback.js";

function fixture(options = {}) {
  const jobs = new Map();
  let next = 0;
  const video = new EventTarget();
  Object.assign(video, { src: "", paused: true, readyState: 1, currentTime: 0, duration: 30, plays: 0, loads: 0,
    getAttribute() { return this.src || null; },
    removeAttribute() { this.src = ""; },
    load() { this.loads++; this.currentTime = 0; },
    pause() { this.paused = true; },
    play() { this.plays++; this.paused = false; return Promise.resolve(); },
  });
  const playback = createBackgroundPlayback(video, "/preview.mp4", .8, {
    schedule(fn, delay) { const id = ++next; jobs.set(id, { fn, delay }); return id; },
    cancel(id) { jobs.delete(id); }, ...options,
  });
  const flush = async delay => {
    for (const [id, job] of [...jobs]) if (job.delay === delay) { jobs.delete(id); job.fn(); }
    await new Promise(resolve => setImmediate(resolve));
  };
  return { video, playback, jobs, flush };
}

test("background stays unloaded until visible and ignores fly-by hovers", async () => {
  const f = fixture();
  assert.equal(f.video.src, "");
  f.playback.setVisible(true);
  f.playback.destroy();
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.plays, 0);
  assert.equal(f.video.src, "");
  assert.equal(f.jobs.size, 0);
});

test("offscreen playback pauses immediately, releases buffers, and restores position", async () => {
  const f = fixture();
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.volume, .35);
  assert.equal(f.video.muted, true);
  assert.equal(f.video.playbackRate, .8);
  f.video.currentTime = 12;
  f.playback.setVisible(false);
  assert.equal(f.video.paused, true);
  await f.flush(BACKGROUND_RELEASE_MS);
  assert.equal(f.video.src, "");
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_START_MS);
  f.video.dispatchEvent(new Event("loadedmetadata"));
  assert.equal(f.video.currentTime, 12);
  assert.equal(f.video.paused, false);
  f.playback.destroy();
  assert.equal(f.video.src, "");
});

test("returning during the grace period avoids a decoder reload", async () => {
  const f = fixture();
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_START_MS);
  f.playback.setVisible(false);
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_RELEASE_MS);
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.loads, 1);
  assert.equal(f.video.paused, false);
  f.playback.destroy();
});

test("dialog, hidden tab and reduced-motion states prevent background playback", async () => {
  const f = fixture({ suspended: true });
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.plays, 0);
  f.playback.setSuspended(false);
  await f.flush(BACKGROUND_START_MS);
  f.playback.setHidden(true);
  assert.equal(f.video.src, "");
  f.playback.setReducedMotion(true);
  f.playback.setHidden(false);
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.plays, 1);
  f.playback.setReducedMotion(false);
  await f.flush(BACKGROUND_START_MS);
  assert.equal(f.video.plays, 2);
  f.playback.setSuspended(true);
  await f.flush(BACKGROUND_RELEASE_MS);
  assert.equal(f.video.src, "");
  f.playback.destroy();
});

test("a late play promise cannot resurrect hidden or destroyed backgrounds", async () => {
  const f = fixture();
  let finish;
  f.video.play = () => new Promise(resolve => { finish = () => { f.video.paused = false; resolve(); }; });
  f.playback.setVisible(true);
  await f.flush(BACKGROUND_START_MS);
  f.playback.destroy();
  finish();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.video.paused, true);
  assert.equal(f.video.src, "");
});
