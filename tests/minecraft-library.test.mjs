import test from 'node:test';
import assert from 'node:assert/strict';
import { cinematicGames, cinematicClips } from '../src/cinematicData.js';
import process from '../src/cinematicProcessMedia.json' with { type: 'json' };
import backgrounds from '../src/backgroundMedia.json' with { type: 'json' };
import visibility from '../src/backgroundVisibility.json' with { type: 'json' };
import qualities from '../src/videoQualities.json' with { type: 'json' };
import manifest from '../deploy/media-manifest.json' with { type: 'json' };
import { selectBackgroundMedia } from '../src/backgroundMedia.js';

test('Minecraft adds four scenes and the second Home shot without replacing existing Home shots', () => {
  assert.deepEqual(cinematicGames.map(g=>[g.id,g.clips.length]), [['cyberpunk',16],['red-dead-redemption-2',5],['fallout-4',14],['fallout-76',18],['minecraft',4]]);
  assert.equal(cinematicClips[1].sourceFilename, 'Render Minecraft Video #1.mkv');
  const home = cinematicClips[1];
  const homePreview = selectBackgroundMedia(home.backgroundSrc);
  assert.equal(homePreview.excerpt.start, 0);
  assert.equal(homePreview.excerpt.end, 13);
  assert.ok(homePreview.excerpt.safeEnd - 13 >= 1.4);
  assert.equal(home.videoSrc, '/media/minecraft-01.mp4');
  assert.equal(selectBackgroundMedia(home.videoSrc).excerpt.end, 3.5);
  assert.deepEqual(cinematicClips.filter(c=>c.id!=='minecraft-1').map(c=>c.id), ['ambient-75','cyberpunk-20260906-14411025-00000209','rdr2-1','fallout76-ambient-23','ambient-296','cyberpunk-3','rdr2-3','fallout76-ambient-20','rdr2-2']);
  for (const game of cinematicGames) assert.deepEqual(game.clips.map(c=>c.sequence),game.clips.map((_,i)=>i+1));
});

test('Minecraft has complete lightweight previews, native player quality and process media below the storage limit', () => {
  const minecraft = cinematicGames.find(g=>g.id==='minecraft');
  const files = new Set(manifest.files.map(f=>'/'+f.key));
  assert.equal(process.minecraft.length,4);
  assert.ok(manifest.totalBytes < 10_000_000_000);
  assert.equal(manifest.files.reduce((sum,f)=>sum+f.bytes,0),manifest.totalBytes);
  for (const clip of minecraft.clips) {
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
