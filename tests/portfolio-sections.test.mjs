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

test("all languages render separate YouTube formats and no documentary section", async () => {
  const vite = await createServer({ configFile: false, esbuild: { jsx: "automatic" }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
  try {
    const { PortfolioPage } = await vite.ssrLoadModule("/src/components/PortfolioPage.jsx");
    const { siteCopy, workSections } = await vite.ssrLoadModule("/src/siteData.js");
    assert.deepEqual(workSections[0].projects.map(p => p.id), ["youtube-02", "youtube-trial-v2", "youtube-01", "youtube-03"]);
    assert.ok(workSections[0].projects.every(p => p.format === "long-form"));
    assert.ok(workSections[1].projects.every(p => p.format === "shorts"));
    for (const copy of Object.values(siteCopy)) {
      const html = renderToStaticMarkup(React.createElement(PortfolioPage, { copy, paused: false, onPlay() {} }));
      assert.deepEqual([...html.matchAll(/<section[^>]* id="([^"]+)"/g)].map(m => m[1]), ["home", "youtube", "youtube-shorts"]);
      assert.equal((html.match(/<h2[^>]*>YouTube<\/h2>/g) || []).length, 2);
      assert.match(html, /id="youtube-format"[^>]*>LONG-FORM/);
      assert.match(html, /id="youtube-shorts-format"[^>]*>SHORTS/);
      assert.doesNotMatch(html, /documentary|format-selector/i);
      assert.match(html, /class="work-section work-section--shorts"/);
      assert.match(html, /data-project-id="short-ring-3"[^>]*is-active/);
      assert.match(html, /class="project-rail project-rail--featured"/);
      assert.match(html, /data-project-id="youtube-02"[^>]*is-active/);
    }
  } finally { await vite.close(); }
});
