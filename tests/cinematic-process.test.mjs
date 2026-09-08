import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { processClips } from "../src/cinematicProcess.js";
import { cinematicGames } from "../src/cinematicData.js";
import { selectBackgroundMedia } from "../src/backgroundMedia.js";
import report from "../scripts/process-media-imported.json" with { type: "json" };

test("process uses exactly the twelve supplied clips in each game's supplied order", () => {
  const names = Object.fromEntries(Object.entries(processClips).map(([game, clips]) => [game, clips.map(clip => clip.sourceFilename)]));
  assert.deepEqual(names["fallout-4"], ["Gameplay 13.mp4", "Gameplay 24.mp4", "Gameplay 11.mp4"]);
  assert.deepEqual(names["fallout-76"], ["Ambient 25.mp4", "Ambient 22.mp4", "Ambient 24.mp4"]);
  assert.deepEqual(names.cyberpunk, ["Cyberpunk 2077 2026.09.06 - 14.53.49.33_00000843.mp4", "Cyberpunk 2077 2026.09.06 - 15.01.58.38_00000133.mp4", "Cyberpunk 2077 2026.09.06 - 15.02.21.39_00000038.mp4"]);
  assert.deepEqual(names["red-dead-redemption-2"], ["RDR 2 #1_00000271.mp4", "RDR 2 #3_00000656.mp4", "Red Dead Redemption 2 2026.09.06 - 15.44.14.45_00000167.mp4"]);
  assert.equal(report.filter(item => item.reused).length, 6);
  for (const game of cinematicGames) {
    assert.equal(processClips[game.id].length, 3);
    for (const clip of processClips[game.id]) {
      const preview = selectBackgroundMedia(clip.videoSrc);
      assert.ok(preview.baked);
      assert.ok(preview.excerpt.safeEnd > preview.excerpt.end);
      for (const asset of [clip.videoSrc, clip.poster, preview.src]) assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), asset);
      if (game.id === "cyberpunk" || game.id === "red-dead-redemption-2") assert.equal(clip.videoSrc, game.clips.find(item => item.id === clip.id).videoSrc);
      else assert.ok(!game.clips.some(item => item.id === clip.id));
    }
  }
});
