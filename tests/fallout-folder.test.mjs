import test from "node:test";
import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { cinematicGames } from "../src/cinematicData.js";
import imported from "../src/falloutFolderMedia.json" with { type: "json" };
import report from "../scripts/fallout-folder-imported.json" with { type: "json" };
import qualities from "../src/videoQualities.json" with { type: "json" };

test("retained Fallout scenes have unique, sequential originals after the R2 reduction", () => {
  assert.equal(report.length, 29);
  for (const [id, count, offset] of [["fallout-4",12,6],["fallout-76",13,5]]) {
    const game = cinematicGames.find(game => game.id === id);
    assert.equal(imported[id].length,count);
    assert.equal(game.clips.length,18);
    assert.equal(new Set(game.clips.map(clip => clip.id)).size,18);
    assert.deepEqual(game.clips.slice(offset).map(clip => clip.sourceFilename), imported[id].map(clip => clip.sourceFilename));
    game.clips.forEach((clip,index) => assert.equal(clip.sequence,index+1));
    for (const clip of imported[id]) {
      const record = report.find(record => record.videoSrc === clip.videoSrc);
      assert.equal(record.game,id);
      assert.equal(statSync(new URL(`../public${clip.videoSrc}`,import.meta.url)).size,record.bytes);
      assert.equal(qualities[clip.videoSrc][0].height,clip.height);
      assert.equal(qualities[clip.videoSrc][0].fps,clip.fps);
      assert.equal(qualities[clip.videoSrc][0].original,true);
    }
  }
});
