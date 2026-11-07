import test from "node:test";
import assert from "node:assert/strict";
import { sceneOpacity } from "../src/sectionTransitions.js";

test("incoming backgrounds fully cover previous videos at 70% viewport coverage", () => {
  for (const height of [640, 942, 1080]) {
    assert.equal(sceneOpacity(height, height), 0);
    assert.equal(sceneOpacity(height * .3, height), 1);
    assert.equal(sceneOpacity(0, height), 1);
    assert.equal(sceneOpacity(-height, height), 1);
  }
});

test("scroll-driven blending is continuous, reversible and has no delayed residue", () => {
  const positions = [1100, 1000, 900, 800, 650, 500, 300, 0];
  const forward = positions.map(top => sceneOpacity(top, 1000));
  assert.deepEqual([...positions].reverse().map(top => sceneOpacity(top, 1000)), [...forward].reverse());
  assert.equal(sceneOpacity(650, 1000), .5);
  assert.ok(forward.every((opacity, i) => opacity >= 0 && opacity <= 1 && (!i || opacity >= forward[i - 1])));
  assert.ok(sceneOpacity(301, 1000) > .9999);
  assert.equal(sceneOpacity(300, 1000), 1);
  assert.equal(sceneOpacity(1100, 1000), 0);
});

test("reduced motion switches backgrounds without a partial blend", () => {
  assert.equal(sceneOpacity(800, 1000, true), 0);
  assert.equal(sceneOpacity(600, 1000, true), 1);
});
