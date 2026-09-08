import assert from "node:assert/strict";
import test from "node:test";
import { cinematicGames, cinematicClips } from "../src/cinematicData.js";
import delivery from "../scripts/cinematic-delivery-imported.json" with { type: "json" };
import originals from "../scripts/cinematic-delivery-20260906.json" with { type: "json" };
import excerpts from "../src/cinematicExcerpts.json" with { type: "json" };
import qualities from "../src/videoQualities.json" with { type: "json" };

const activeFiles = delivery.files.filter(file => !file.removed);
const activeOriginals = originals.filter(file => !file.excluded);

test("all retained delivered files appear once with their actual filenames and native qualities", () => {
  const cyberpunk = cinematicGames.find(game => game.id === "cyberpunk").clips;
  const rdr = cinematicGames.find(game => game.id === "red-dead-redemption-2").clips;
  const clips = [...cyberpunk, ...rdr];
  assert.equal(cyberpunk.length, 16);
  assert.equal(rdr.length, 5);
  assert.equal(new Set(clips.map(clip => clip.id)).size, 21);
  assert.equal(new Set(activeFiles.map(file => file.sha256)).size, 21);
  assert.deepEqual(new Set(clips.map(clip => clip.sourceFilename)), new Set(activeOriginals.map(file => file.name)));
  for (const clip of clips) {
    const record = delivery.files.find(file => file.id === clip.id);
    assert.equal(clip.videoSrc, record.videoSrc);
    assert.equal(clip.height, 2160);
    assert.equal(clip.width, 3840);
    assert.equal(clip.hasAudio, false);
    assert.equal(qualities[clip.videoSrc][0].fps, record.fps);
    assert.equal(qualities[clip.videoSrc][0].src, clip.videoSrc);
    assert.equal(qualities[clip.videoSrc][0].original, true);
  }
});

test("retained replacements use current originals and Home starts Cyberpunk with scene 05", () => {
  for (const id of ["cyberpunk-1", "cyberpunk-3", "rdr2-1", "rdr2-2", "rdr2-3"]) {
    const clip = cinematicGames.flatMap(game => game.clips).find(clip => clip.id === id);
    assert.equal(clip.videoSrc, delivery.files.find(file => file.id === id).videoSrc);
    assert.ok(clip.videoSrc.includes("-r20260906-"));
  }
  assert.equal(cinematicClips[1], cinematicGames.find(game => game.id === "cyberpunk").clips[4]);
  for (const source of ["cyberpunk-1", "cyberpunk-3", "rdr2-1", "rdr2-2", "rdr2-3"].map(stem => `/media/${stem}.mp4`)) {
    assert.equal(qualities[source], undefined);
    assert.equal(excerpts[source], undefined);
  }
});

test("shorter-than-3.5-second sources never use negative seeks or a range beyond the file", () => {
  const shorter = activeFiles.filter(file => file.duration < 3.5);
  assert.equal(shorter.length, 3);
  for (const file of shorter) {
    const excerpt = excerpts[file.videoSrc];
    assert.equal(excerpt.start, 0);
    assert.equal(excerpt.end, file.duration);
  }
});
