import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("cinematic includes the process section between scenes and About with localized controls", async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { CinematicPage } = await vite.ssrLoadModule("/src/components/CinematicPage.jsx");
    const { Header } = await vite.ssrLoadModule("/src/components/Header.jsx");
    const { siteCopy } = await vite.ssrLoadModule("/src/siteData.js");
    const { cinematicClips, cinematicGames } = await vite.ssrLoadModule("/src/cinematicData.js");
    const { PortfolioPage } = await vite.ssrLoadModule("/src/components/PortfolioPage.jsx");
    const { WorkSection } = await vite.ssrLoadModule("/src/components/WorkSection.jsx");
    const { CinematicProcess } = await vite.ssrLoadModule("/src/components/CinematicProcess.jsx");
    const { processClips, processCopy } = await vite.ssrLoadModule("/src/cinematicProcess.js");
    const { GameLibrary } = await vite.ssrLoadModule("/src/components/GameLibrary.jsx");
    const { cinematicCopy } = await vite.ssrLoadModule("/src/cinematicData.js");
    assert.deepEqual(cinematicClips.map(clip => clip.id), ["ambient-75", "cyberpunk-20260906-14411025-00000209", "rdr2-1", "fallout76-ambient-23", "ambient-296", "cyberpunk-3", "rdr2-3", "fallout76-ambient-20", "rdr2-2"]);
    for (const language of ["ENG", "PTBR", "ES"]) {
      const copy = siteCopy[language];
      const html = renderToStaticMarkup(React.createElement(CinematicPage, { language, copy, paused: false, onPlay() {} }));
      assert.equal((html.match(/<section\b/g) || []).length, 4);
      for (const id of ["home", "games", "process", "about", "contact"]) assert.ok(html.includes(`id="${id}"`));
      assert.ok(html.includes('class="hero-title"'));
      assert.ok(html.includes('class="project-carousel '));
      assert.ok(html.indexOf('id="games"') < html.indexOf('id="process"'));
      assert.ok(html.indexOf('id="process"') < html.indexOf('id="about"'));
      for (const game of cinematicGames) {
        const process = renderToStaticMarkup(React.createElement(CinematicProcess, { game, language, paused: false }));
        assert.ok(process.includes(processClips[game.id][0].poster));
        assert.ok(process.includes(processCopy[language].heading));
        for (const paragraph of processCopy[language].paragraphs) assert.ok(process.includes(paragraph));
        assert.ok(!process.includes("process-copy__eyebrow") && !process.includes("process-copy__world") && !process.includes("<small>"));
        assert.ok(!/<video[^>]* src=/.test(process));
        assert.equal((process.match(/<video/g) || []).length, 1);
      }
      const labels = cinematicCopy[language];
      assert.ok(html.includes(labels.choose));
      const library = renderToStaticMarkup(React.createElement(GameLibrary, { gameId: cinematicGames[0].id, labels }));
      for (const game of cinematicGames) {
        assert.ok(library.includes(game.title));
        assert.ok(library.includes(game.cover));
      }
      assert.ok(!html.includes("Comparison") && !html.includes("Comparação"));
      assert.ok(!library.includes("Minecraft") && !library.includes("Dark Souls"));
      assert.ok(html.includes("Cyberpunk"));
      assert.ok(!/Back to portfolio|Voltar ao portfólio|Volver al portafolio|Ambient collection|Coleção Ambient|Colección Ambient/i.test(html));
      assert.ok(html.includes(cinematicClips[0].poster));
      // Server output doesn't download a hidden section's video.
      assert.ok(!/<video[^>]* src=/.test(html));
      const header = renderToStaticMarkup(React.createElement(Header, { language, copy, cinematic: true }));
      assert.ok(header.includes('href="/cinematic#about"'));
      assert.ok(header.includes('href="https://discord.com/users/1500901931101716725"'));
      const portfolio = renderToStaticMarkup(React.createElement(PortfolioPage, { copy, paused: false, onPlay() {} }));
      const ids = [...portfolio.matchAll(/<section[^>]* id="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(ids, ["home", "youtube", "documentary"]);
      assert.ok(portfolio.includes("Long-Form"));
      assert.ok(portfolio.includes("Shorts"));
      assert.ok(portfolio.includes('/media/home-frame.jpg'));
      assert.ok(!/hero-poster|youtube-poster|film-poster|documentary-poster|The Last Horizon|The Design of Suspense/.test(portfolio));
      for (const id of ["youtube"]) {
        const empty = renderToStaticMarkup(React.createElement(WorkSection, { section: { id, projects: [] }, copy, onPlay() {} }));
        assert.ok(empty.includes(copy.library.empty));
        assert.ok(!/<video|<img|class="project-item /.test(empty));
      }
    }
  } finally { await vite.close(); }
});
