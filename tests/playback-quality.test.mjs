import test from "node:test";
import assert from "node:assert/strict";
import qualities from "../src/videoQualities.json" with { type: "json" };
import { selectPlaybackQuality, lighterPlaybackQuality, backgroundViewport, watchPlaybackPressure } from "../src/playbackQuality.js";

test("automatic playback avoids the 1.4 GB original while preserving every manual option", () => {
  const items = qualities["/media/youtube-loop.mp4"];
  assert.equal(selectPlaybackQuality(items).height, 720);
  assert.ok(items.some(q => q.original && q.height === 1080));
  assert.equal(selectPlaybackQuality(qualities["/media/home-loop.mp4"]).height, 1080);
  assert.equal(selectPlaybackQuality([]), undefined);
});

test("fallback only uses real smaller renditions and stops at the last available quality", () => {
  const items = qualities["/media/youtube-loop.mp4"];
  const initial = selectPlaybackQuality(items);
  assert.equal(lighterPlaybackQuality(items, initial.src).height, 480);
  assert.equal(lighterPlaybackQuality(items, items.find(q => q.height === 144).src), undefined);
  const single = [{src:"/original.mp4",height:2160,fps:60,original:true}];
  assert.equal(selectPlaybackQuality(single), single[0]);
  assert.equal(lighterPlaybackQuality(single, single[0].src), undefined);
});

test("background dimensions stay bounded without upscaling small or portrait screens", () => {
  assert.deepEqual(backgroundViewport(3840,2160), {width:1920,height:1080});
  assert.deepEqual(backgroundViewport(390,844), {width:390,height:844});
  assert.deepEqual(backgroundViewport(1080,1920), {width:1080,height:1920});
});

test("decoding pressure requires two sustained samples, ignores pauses and cleans its timer", () => {
  let tick, cleared = false, count = 0, total = 0, dropped = 0;
  const video = {paused:false,seeking:false,readyState:4,getVideoPlaybackQuality:()=>({totalVideoFrames:total,droppedVideoFrames:dropped})};
  const stop=watchPlaybackPressure(video,()=>count++, {setInterval(fn){tick=fn;return 7;},clearInterval(id){assert.equal(id,7);cleared=true;}});
  tick(); total=180;dropped=30;tick(); assert.equal(count,0);
  total=360;dropped=60;tick(); assert.equal(count,1);
  video.paused=true;total=540;dropped=90;tick();
  video.paused=false;total=720;dropped=120;tick(); assert.equal(count,1);
  stop();assert.ok(cleared);
});
