import assert from "node:assert/strict";
import test from "node:test";
import { railSlots, nextRailPreview } from "../src/projectRail.js";
import { workSections } from "../src/siteData.js";
import { cinematicGames } from "../src/cinematicData.js";
import { existsSync } from "node:fs";

test("empty and short rails never invent duplicate projects or hidden selections", () => {
  for (let count = 0; count <= 3; count++) {
    const projects = Array.from({ length: count }, (_, id) => ({ id }));
    const slots = railSlots(projects);
    assert.equal(slots.length, count);
    assert.ok(slots.every(slot => !slot.isPeek));
    assert.deepEqual(slots.map(slot => slot.project), projects);
  }
});

test("four-video rail reaches every real item and wraps without losing a visible row", () => {
  const projects = Array.from({ length: 4 }, (_, id) => ({ id }));
  const seen = new Set();
  for (let index = -1; index < 5; index++) {
    const slots = railSlots(projects, index);
    const visible = slots.filter(slot => !slot.isPeek);
    assert.equal(visible.length, 3);
    assert.equal(new Set(visible.map(slot => slot.project.id)).size, 3);
    visible.forEach(slot => seen.add(slot.project.id));
  }
  assert.equal(seen.size, 4);
});

test("catalog includes only real playable projects and supplied media assets", () => {
  assert.deepEqual(workSections.map(section => section.id), ["youtube", "documentary"]);
  assert.deepEqual(cinematicGames.map(game => game.title), ["Cyberpunk", "Red Dead Redemption 2", "Fallout 4", "Fallout 76"]);
  assert.ok(cinematicGames.every(game => game.clips.length > 0));
  assert.equal(cinematicGames.find(game => game.id === "cyberpunk").clips.length, 16);
  assert.equal(cinematicGames.find(game => game.id === "red-dead-redemption-2").clips.length, 5);
  assert.deepEqual(cinematicGames.find(game => game.id === "fallout-76").clips.slice(0, 5).map(clip => clip.title), ["Ambient 23", "Ambient 8", "Ambient 18", "Ambient 19", "Ambient 20"]);
  const shorts = workSections[0].projects.filter(project => project.format === "shorts");
  assert.equal(shorts.length, 6);
  assert.ok(shorts.every(project => project.orientation === "portrait" && project.fps === 60 && project.width === 1080 && project.height === 1920));
  for (const game of cinematicGames) assert.ok(game.cover && existsSync(new URL(`../public${game.cover}`, import.meta.url)), game.title);
  for (const project of [...workSections.flatMap(section => section.projects), ...cinematicGames.flatMap(game => game.clips)]) {
    assert.ok(project.sourceFilename);
    for (const asset of [project.videoSrc, project.thumb, project.poster]) assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), asset);
  }
  for (const obsolete of ["hero-poster", "film-poster", "youtube-poster", "documentary-poster", "portrait", ...["film", "youtube", "documentary"].flatMap(type => [1, 2, 3].map(number => `${type}-0${number}`))]) {
    assert.ok(!existsSync(new URL(`../public/media/${obsolete}.jpg`, import.meta.url)), obsolete);
  }
});


test("automatic cinematic previews visit every scene, wrap, and remain selectable", () => {
  for (const game of cinematicGames) {
    let active = game.clips[0].id;
    let start = 0;
    const seen = new Set([active]);
    for (let step = 1; step <= game.clips.length; step++) {
      const next = nextRailPreview(game.clips, active, start);
      assert.equal(next.project.id, game.clips[step % game.clips.length].id);
      assert.ok(railSlots(game.clips, next.startIndex).some(slot => !slot.isPeek && slot.project.id === next.project.id));
      seen.add(next.project.id);
      active = next.project.id;
      start = next.startIndex;
    }
    assert.equal(seen.size, game.clips.length);
    assert.equal(active, game.clips[0].id);
  }
  assert.equal(nextRailPreview([], undefined, 0), null);
  assert.equal(nextRailPreview([{ id: "one" }], "one", 0), null);
});
