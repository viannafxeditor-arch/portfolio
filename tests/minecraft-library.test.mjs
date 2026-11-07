import test from 'node:test';
import assert from 'node:assert/strict';
import { cinematicGames, cinematicClips, cinematicHome } from '../src/cinematicData.js';
import process from '../src/cinematicProcessMedia.json' with { type: 'json' };
import backgrounds from '../src/backgroundMedia.json' with { type: 'json' };
import visibility from '../src/backgroundVisibility.json' with { type: 'json' };
import qualities from '../src/videoQualities.json' with { type: 'json' };
import manifest from '../deploy/media-manifest.json' with { type: 'json' };
import { selectBackgroundMedia } from '../src/backgroundMedia.js';

test('Cinematics contains only Minecraft, with 262 first in the carousel and transitions on Home', () => {
  assert.deepEqual(cinematicGames.map(g=>[g.id,g.clips.length]), [['minecraft',10]]);
  assert.deepEqual(cinematicClips.slice(0,6).filter(c=>c.id!=='minecraft-clean-transitions').map(c=>c.sourceFilename), ['262.mp4','19.mp4','24.mp4','35.mp4','86.mp4']);
  assert.equal(cinematicClips[0].id, 'minecraft-new-262');
  assert.equal(cinematicClips[1].id, 'minecraft-clean-transitions');
  assert.equal(cinematicHome.backgroundSrc, '/cinematic-media/minecraft/clean-transitions-bg.mp4');
  assert.deepEqual(cinematicClips.slice(6).map(c=>c.id), ['minecraft-1','minecraft-2','minecraft-3','minecraft-4']);
  for (const game of cinematicGames) assert.deepEqual(game.clips.map(c=>c.sequence),game.clips.map((_,i)=>i+1));
});
test('Minecraft has complete lightweight previews, native player quality and process media below the storage limit', () => {
  const minecraft = cinematicGames.find(g=>g.id==='minecraft');
  const files = new Set(manifest.files.map(f=>'/'+f.key));
  assert.equal(process.minecraft.length,4);
  assert.ok(manifest.totalBytes < 10_000_000_000);
  assert.equal(manifest.files.reduce((sum,f)=>sum+f.bytes,0),manifest.totalBytes);
  for (const clip of minecraft.clips.filter(c => c.videoSrc.startsWith("/media/"))) {
    assert.ok(files.has(clip.videoSrc) && files.has(clip.poster));
    assert.equal(qualities[clip.videoSrc][0].height,1080);
    assert.equal(qualities[clip.videoSrc][0].fps,60);
    assert.ok(qualities[clip.videoSrc][0].original);
    const bg = backgrounds[clip.videoSrc];
    assert.equal(bg.variants.length,1);
    assert.ok(files.has(bg.variants[0].src));
    assert.equal(visibility[clip.videoSrc].scannedSrc,bg.variants[0].src);
    assert.ok(bg.sourceStart + bg.duration <= bg.sourceDuration);
  }
  for (const removed of ['characters-10','ambient-304','ambient-428','ambient-340']) {
    assert.ok(!manifest.files.some(f=>f.key.includes('fallout-4-'+removed+'-')));
  }
});
