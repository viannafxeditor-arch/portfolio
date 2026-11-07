import test from "node:test";
import assert from "node:assert/strict";
import { createYouTubeVolumeRamp } from "../src/youtubeVolumeRamp.js";
function setup() {
  let volume = 100, muted = false, tick;
  const p = {setVolume(v) {volume=v;},getVolume:()=>volume,isMuted:()=>muted};
  const ramp = createYouTubeVolumeRamp(p,{setInterval(fn){tick=fn;return 1;},clearInterval(){tick=null;}});
  return {p,ramp,step(){tick?.();},running:()=>!!tick,mute(){muted=true;}};
}
test("volume rises from 30 to 50 over twenty ticks and stops",()=>{
 const t=setup(); assert.equal(t.p.getVolume(),30); t.ramp.start();
 for(let i=0;i<20;i++)t.step(); assert.equal(t.p.getVolume(),50); assert.equal(t.running(),false);
 t.ramp.start(); assert.equal(t.running(),false);
});
test("pause/resume preserves ramp; user volume and mute cancel it",()=>{
 const t=setup(); t.ramp.start(); t.step(); t.ramp.pause(); t.step(); assert.equal(t.p.getVolume(),31);
 t.ramp.start(); t.step(); assert.equal(t.p.getVolume(),32); t.p.setVolume(15); t.step(); assert.equal(t.p.getVolume(),15); assert.equal(t.running(),false);
 const m=setup();m.ramp.start();m.mute();m.step();assert.equal(m.running(),false);
 const d=setup();d.ramp.start();d.ramp.destroy();d.step();assert.equal(d.p.getVolume(),30);
});
