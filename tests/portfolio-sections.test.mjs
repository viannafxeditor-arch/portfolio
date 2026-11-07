import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { centerRailProject, nextRailPreview, wrapIndex } from "../src/projectRail.js";
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
    assert.deepEqual(workSections[0].projects.map(p => p.id), ["youtube-mugm-assassin", "youtube-02", "youtube-trial-v2", "youtube-01", "youtube-03"]);
    assert.ok(workSections[0].projects.every(p => p.format === "long-form"));
    assert.equal(workSections.length, 1);
    for (const copy of Object.values(siteCopy)) {
      const html = renderToStaticMarkup(React.createElement(PortfolioPage, { copy, paused: false, onPlay() {} }));
      assert.deepEqual([...html.matchAll(/<section[^>]* id="([^"]+)"/g)].map(m => m[1]), ["home", "youtube", "clients"]);
      assert.deepEqual([...html.matchAll(/href="https:\/\/www.youtube.com\/@([^"]+)"/g)].map(m => m[1]), ["MugmV2", "Taejon"]);
      assert.equal((html.match(/<h2[^>]*>YouTube<\/h2>/g) || []).length, 1);
      assert.match(html, /id="youtube-format"[^>]*>LONG-FORM/);
      assert.doesNotMatch(html, /documentary|format-selector|youtube-shorts|short-ring|>SHORTS</i);
      assert.match(html, /class="project-rail project-rail--featured"/);
      assert.match(html, /data-project-id="youtube-mugm-assassin"[^>]*is-active/);
    }
  } finally { await vite.close(); }
});
