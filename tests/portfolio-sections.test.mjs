import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { centerRailProject, nextRailPreview, wrapIndex, railSlots } from "../src/projectRail.js";
import { cinematicGames } from "../src/cinematicData.js";

test("cinematic previews advance the centered thumbnail through every game and wraparound", () => {
  for (const game of cinematicGames) {
    for (let index = 0; index < game.clips.length; index++) {
      const next = nextRailPreview(game.clips, game.clips[index].id, index - 1, true);
      assert.equal(next.project.id, game.clips[(index + 1) % game.clips.length].id);
      assert.equal(centerRailProject(game.clips, next.startIndex).id, next.project.id);
    }
  }
});

test("shorts feature the center card through forward and backward wraparound", () => {
  const projects = Array.from({ length: 6 }, (_, id) => ({ id }));
  for (let start = -8; start <= 8; start++) {
    assert.equal(centerRailProject(projects, start).id, wrapIndex(start + 1, 6));
  }
  assert.equal(centerRailProject(projects, -1).id, 0);
  assert.equal(centerRailProject([]), undefined);
  assert.equal(centerRailProject(projects.slice(0, 1)).id, 0);
  assert.equal(centerRailProject(projects.slice(0, 3)).id, 1);
});

test("all languages feature the new Long-Form video, clients, and no Shorts or documentary section", async () => {
  const vite = await createServer({ configFile: false, define: { "import.meta.env.VITE_CLIENTS_PREVIEW": JSON.stringify("true") }, esbuild: { jsx: "automatic" }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
  try {
    const { PortfolioPage } = await vite.ssrLoadModule("/src/components/PortfolioPage.jsx");
    const { siteCopy, workSections, homeProject } = await vite.ssrLoadModule("/src/siteData.js");
    assert.equal(homeProject.youtubeId, undefined);
    assert.equal(homeProject.videoSrc, "/media/backgrounds/mugm-home-simplified-v1.mp4");
    assert.equal(workSections[0].projects[0].youtubeId, "rH3nU3F1oF8");
    assert.equal(workSections[0].projects[0].startSeconds, 0);
    assert.deepEqual(workSections[0].projects.map(p => p.id), ["youtube-mugm-assassin", "youtube-tae-secret-base"]);
    assert.ok(workSections[0].projects.every(p => p.format === "long-form"));
    assert.equal(workSections.length, 1);
    for (const copy of Object.values(siteCopy)) {
      const html = renderToStaticMarkup(React.createElement(PortfolioPage, { copy, paused: false, onPlay() {} }));
      assert.deepEqual([...html.matchAll(/<section[^>]* id="([^"]+)"/g)].map(m => m[1]), ["home", "youtube", "clients"]);
      const clientsHtml = html.match(/<section[^>]* id="clients"[\s\S]*?<\/section>/)?.[0] || "";
      assert.deepEqual([...clientsHtml.matchAll(/href="https:\/\/www.youtube.com\/@([^"]+)"/g)].map(m => m[1]), ["MugmV2", "Taejon", "Lomedy"]);
      assert.equal((html.match(/<h2[^>]*>YouTube<\/h2>/g) || []).length, 1);
      assert.match(html, /id="youtube-format"[^>]*>LONG-FORM/);
      assert.doesNotMatch(html, /documentary|format-selector|youtube-shorts|short-ring|>SHORTS</i);
      assert.match(html, /class="project-rail has-video-details project-rail--featured"/);
      assert.match(html, /data-project-id="youtube-mugm-assassin"[^>]*is-active/);
      assert.match(html, /data-scene="youtube"[^>]*><video[^>]*poster="\/media\/mugm-home-simplified-poster.jpg"/);
      assert.doesNotMatch(html, /portfolio-scene--youtube/);
    }
  } finally { await vite.close(); }
});



test("YouTube cards show the correct creator and confirmed YT Jobs verification states", async () => {
  const vite = await createServer({ configFile: false, esbuild: { jsx: "automatic" }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
  try {
    const { VideoDetails } = await vite.ssrLoadModule("/src/components/VideoDetails.jsx");
    const { workSections } = await vite.ssrLoadModule("/src/siteData.js");
    const [mugm, tae] = workSections[0].projects;
    assert.equal(tae.youtubeId, "GpLefsKpu-g");
    assert.equal(tae.startSeconds, 0);
    assert.equal(tae.youtubeVerified, true);
    const card = project => renderToStaticMarkup(React.createElement(VideoDetails, {project,lang:"en",details:{id:project.youtubeId,creator:project.creator,title:project.title,views:12345}}));
    assert.match(card(mugm), /Work verified on YT Jobs/);
    const taeHtml=card(tae);
    assert.match(taeHtml,/Tae/);assert.match(taeHtml,/Work verified on YT Jobs/);
    assert.doesNotMatch(taeHtml,/Mugm|verification pending/);
    assert.match(taeHtml,/ytjobs.co\/talent\/profile\/636450/);
  } finally { await vite.close(); }
});




test("two-video featured carousel starts with Mugm and wraps in either direction", () => {
  const projects = [{id:"mugm"},{id:"tae"}];
  for (const [start, expected] of [[-1,"mugm"],[0,"tae"],[1,"mugm"],[-2,"tae"]]) {
    assert.equal(centerRailProject(projects,start,true).id,expected);
    assert.equal(railSlots(projects,start,true)[2].project.id,expected);
    const next=nextRailPreview(projects,expected,start,true);
    assert.equal(centerRailProject(projects,next.startIndex,true).id,expected === "mugm" ? "tae" : "mugm");
  }
});
