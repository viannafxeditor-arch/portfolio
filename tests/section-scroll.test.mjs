import assert from "node:assert/strict";
import test from "node:test";
import { adjacentSection, animateSectionScroll, easeOutCubic, SCROLL_DURATION } from "../src/sectionScroll.js";

test("scroll starts promptly, slows at the end and lands exactly on the section", () => {
  let callback;
  const positions = [];
  let finished = false;
  const clock = { requestAnimationFrame: fn => { callback = fn; return 1; }, cancelAnimationFrame() {} };
  animateSectionScroll({ from: 100, to: 1100, clock, write: value => positions.push(value), finish: () => { finished = true; } });
  for (const time of [0, 250, 500, 750, SCROLL_DURATION]) callback(time);
  assert.equal(SCROLL_DURATION, 1000);
  assert.equal(positions[0], 100);
  assert.equal(positions.at(-1), 1100);
  const steps = positions.slice(1).map((value, index) => value - positions[index]);
  assert.ok(steps.every((step, index) => index === 0 || step < steps[index - 1]));
  assert.ok(positions[2] > 900);
  assert.ok(finished);
  assert.equal(easeOutCubic(-1), 0);
  assert.equal(easeOutCubic(2), 1);
});

test("scroll can be cancelled when a modal opens or the route changes", () => {
  const pending = new Map();
  let id = 0;
  let finished = false;
  const clock = { requestAnimationFrame: fn => { pending.set(++id, fn); return id; }, cancelAnimationFrame: id => pending.delete(id) };
  const cancel = animateSectionScroll({ from: 0, to: 1000, clock, write() {}, finish: () => { finished = true; } });
  cancel();
  assert.equal(pending.size, 0);
  assert.equal(finished, false);
});

test("section navigation moves one viewport and clamps at page boundaries", () => {
  const stops = [0, 900, 1800];
  assert.equal(adjacentSection(stops, 0, 1), 900);
  assert.equal(adjacentSection(stops, 901, 1), 1800);
  assert.equal(adjacentSection(stops, 900, -1), 0);
  assert.equal(adjacentSection(stops, 0, -1), 0);
  assert.equal(adjacentSection(stops, 1800, 1), 1800);
});
