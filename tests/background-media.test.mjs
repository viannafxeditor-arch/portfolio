import assert from "node:assert/strict";
import test from "node:test";
import { selectBackgroundMedia } from "../src/backgroundMedia.js";
import backgrounds from "../src/backgroundMedia.json" with { type: "json" };
import qualities from "../src/videoQualities.json" with { type: "json" };
import { homeProject, workSections } from "../src/siteData.js";
import { youtubePlayerOptions } from "../src/youtubePlayer.js";
import { cinematicGames } from "../src/cinematicData.js";

test("hosted backgrounds have separate media while player originals remain the maximum quality", () => {
  for (const project of [...workSections.flatMap(section => section.projects), ...cinematicGames.flatMap(game => game.clips)].filter(project => !project.youtubeId)) {
    const selected = selectBackgroundMedia(project.videoSrc);
    assert.ok(selected.baked, project.videoSrc);
    assert.ok(selected.src.startsWith("/media/backgrounds/"));
    assert.notEqual(selected.src, project.videoSrc);
    const original = qualities[project.videoSrc].find(quality => quality.original);
    assert.equal(original.src, project.videoSrc);
    assert.ok(qualities[project.videoSrc].every(quality => quality.height <= original.height));
  }
});

test("featured YouTube video starts at zero with silent looping backgrounds and normal player controls", () => {
  const homeBackground = selectBackgroundMedia(homeProject.videoSrc);
  assert.equal(homeBackground.src, homeProject.videoSrc);
  assert.equal(homeBackground.playbackRate, 1);
  assert.equal(homeBackground.excerpt, undefined);
  assert.deepEqual(selectBackgroundMedia(workSections[0].projects[0].backgroundSrc), homeBackground);
  const background = youtubePlayerOptions(workSections[0].projects[0], true, "https://www.viannafx.media");
  const player = youtubePlayerOptions(workSections[0].projects[0], false, "https://www.viannafx.media");
  assert.equal(background.videoId, "rH3nU3F1oF8");
  assert.equal(background.playerVars.start, 0);
  assert.equal(player.playerVars.start, 0);
  assert.equal(background.playerVars.mute, 1);
  assert.equal(background.playerVars.loop, 1);
  assert.equal(background.playerVars.playlist, background.videoId);
  assert.equal(player.playerVars.controls, 1);
  assert.equal(player.playerVars.mute, undefined);
  assert.equal(player.playerVars.origin, "https://www.viannafx.media");
});

test("1080p screens avoid 4K decoding while larger screens retain a native 4K background", () => {
  const source = "/media/home-loop.mp4";
  assert.equal(selectBackgroundMedia(source, 1920).src, backgrounds[source].variants[0].src);
  assert.equal(selectBackgroundMedia(source, 3840).src, backgrounds[source].variants[1].src);
  assert.equal(backgrounds[source].variants[1].height, 2160);
  assert.equal(selectBackgroundMedia(source, 1080, 1920).src, backgrounds[source].variants[0].src);
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
