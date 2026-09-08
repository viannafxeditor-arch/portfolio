import assert from "node:assert/strict";
import test from "node:test";
import { selectBackgroundMedia } from "../src/backgroundMedia.js";
import backgrounds from "../src/backgroundMedia.json" with { type: "json" };
import qualities from "../src/videoQualities.json" with { type: "json" };
import { workSections } from "../src/siteData.js";
import { cinematicGames } from "../src/cinematicData.js";

test("all backgrounds have separate media while player originals remain the maximum quality", () => {
  for (const project of [...workSections.flatMap(section => section.projects), ...cinematicGames.flatMap(game => game.clips)]) {
    const selected = selectBackgroundMedia(project.videoSrc);
    assert.ok(selected.baked, project.videoSrc);
    assert.ok(selected.src.startsWith("/media/backgrounds/"));
    assert.notEqual(selected.src, project.videoSrc);
    const original = qualities[project.videoSrc].find(quality => quality.original);
    assert.equal(original.src, project.videoSrc);
    assert.ok(qualities[project.videoSrc].every(quality => quality.height <= original.height));
  }
});

test("1080p screens avoid 4K decoding while larger screens retain a native 4K background", () => {
  const source = "/media/home-loop.mp4";
  assert.equal(selectBackgroundMedia(source, 1920).src, backgrounds[source].variants[0].src);
  assert.equal(selectBackgroundMedia(source, 3840).src, backgrounds[source].variants[1].src);
  assert.equal(backgrounds[source].variants[1].height, 2160);
  assert.equal(selectBackgroundMedia(source, 1080, 1920).src, backgrounds[source].variants[1].src);
  assert.equal(selectBackgroundMedia(source, 1920, 1080).src, backgrounds[source].variants[0].src);
  const portrait = backgrounds["/media/short-ring-1.webm"].variants[0];
  assert.equal(portrait.width / portrait.height, 9 / 16);
});

test("cinematic derivatives preserve the central start and provide room for adaptive fades", () => {
  for (const game of cinematicGames) for (const clip of game.clips) {
    const media = backgrounds[clip.videoSrc];
    assert.equal(media.excerpt.end - media.excerpt.start, 3.5);
    assert.ok(media.duration - media.excerpt.end >= 1.4, clip.title);
    assert.ok(Math.abs(media.sourceStart - Math.max(0, (media.sourceDuration - 3.5) / 2)) < .001);
  }
});
