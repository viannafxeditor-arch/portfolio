import assert from "node:assert/strict";
import test from "node:test";
import { clampSeek, formatTime, fullscreenVideoLayout, createIdleCountdown } from "../src/mediaControls.js";

test("five-second seeks stay inside the playable duration", () => {
  assert.equal(clampSeek(2 - 5, 100), 0);
  assert.equal(clampSeek(98 + 5, 100), 100);
  assert.equal(clampSeek(40 + 5, 100), 45);
  assert.equal(clampSeek(40 - 5, 100), 35);
  assert.equal(clampSeek(5, NaN), 0);
  assert.equal(clampSeek(Infinity, 100), 0);
});

test("time labels remain readable before loading and across hour boundaries", () => {
  assert.equal(formatTime(NaN), "0:00");
  assert.equal(formatTime(284.61), "4:44");
  assert.equal(formatTime(3600), "1:00:00");
  assert.equal(formatTime(-1), "0:00");
});

test("fullscreen fills landscape, ultrawide and portrait screens without stretching", () => {
  for (const [width, height] of [[1920, 1080], [2560, 1080], [390, 844]]) {
    const layout = fullscreenVideoLayout(width, height, 16 / 9, 180);
    assert.ok(Math.abs(layout.width / layout.height - 16 / 9) < .0001);
    assert.ok(layout.width * layout.scale >= width - .001);
    assert.ok(layout.height * layout.scale >= height - .001);
    assert.ok(layout.height <= height - 180);
  }
});

test("portrait fullscreen preserves the complete 9:16 frame on every screen shape", () => {
  for (const [width, height] of [[1920, 1080], [2560, 1080], [390, 844], [320, 568]]) {
    const layout = fullscreenVideoLayout(width, height, 9 / 16, 200, "contain");
    assert.ok(Math.abs(layout.width / layout.height - 9 / 16) < .0001);
    assert.ok(layout.width * layout.scale <= width + .001);
    assert.ok(layout.height * layout.scale <= height + .001);
    assert.ok(Math.abs(layout.width * layout.scale - width) < .001 || Math.abs(layout.height * layout.scale - height) < .001);
  }
});

test("fullscreen inactivity waits two seconds, restarts on activity and cancels on exit", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let hidden = 0;
  const idle = createIdleCountdown(() => hidden++);
  idle.restart();
  t.mock.timers.tick(1999);
  assert.equal(hidden, 0);
  idle.restart();
  t.mock.timers.tick(1999);
  assert.equal(hidden, 0);
  t.mock.timers.tick(1);
  assert.equal(hidden, 1);
  idle.restart();
  idle.cancel();
  t.mock.timers.tick(2000);
  assert.equal(hidden, 1);
});
