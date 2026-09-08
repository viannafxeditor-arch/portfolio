import assert from "node:assert/strict";
import test from "node:test";
import { pageFromPath, pathForPage, runPageTransition } from "../src/pageNavigation.js";

test("both destinations support direct links and trailing slashes", () => {
  for (const page of ["portfolio", "cinematic"]) assert.equal(pageFromPath(pathForPage(page)), page);
  assert.equal(pageFromPath("/cinematic/"), "cinematic");
});

test("navigation swaps pages under black before revealing the destination", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const events = [];
  runPageTransition({ swap: () => events.push("swap"), reveal: () => events.push("reveal"), finish: () => events.push("finish") });
  t.mock.timers.tick(1499);
  assert.deepEqual(events, []);
  t.mock.timers.tick(1);
  assert.deepEqual(events, ["swap"]);
  t.mock.timers.tick(1199);
  assert.deepEqual(events, ["swap"]);
  t.mock.timers.tick(1);
  assert.deepEqual(events, ["swap", "reveal"]);
  t.mock.timers.tick(1500);
  assert.deepEqual(events, ["swap", "reveal", "finish"]);
});

test("interrupted navigation cannot change the route or reveal a stale page", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const events = [];
  const cancel = runPageTransition({ swap: () => events.push("swap"), reveal: () => events.push("reveal"), finish: () => events.push("finish") });
  t.mock.timers.tick(400);
  cancel();
  t.mock.timers.tick(5000);
  assert.deepEqual(events, []);
});
