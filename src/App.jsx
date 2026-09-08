import { useEffect, useState } from "react";
import { Header } from "./components/Header.jsx";
import { CinemaPlayer } from "./components/CinemaPlayer.jsx";
import { CinematicPage } from "./components/CinematicPage.jsx";
import { PortfolioPage } from "./components/PortfolioPage.jsx";
import { PageTransition } from "./components/PageTransition.jsx";
import { usePageNavigation } from "./hooks/usePageNavigation.js";
import { useSmoothSections } from "./hooks/useSmoothSections.js";
import { siteCopy } from "./siteData.js";

export function App() {
  const [language, setLanguage] = useState(() => {
    try { const saved = localStorage.getItem("vianna-language"); return Object.hasOwn(siteCopy, saved) ? saved : "ENG"; }
    catch { return "ENG"; }
  });
  const [playingProject, setPlayingProject] = useState(null);
  const copy = siteCopy[language];
  const { page, transition, navigate } = usePageNavigation(copy.hero.title);
  const cinematic = page === "cinematic";
  const paused = Boolean(playingProject);
  const navigationLocked = paused || Boolean(transition);
  useSmoothSections(page, navigationLocked);

  useEffect(() => {
    document.documentElement.lang = copy.lang;
    document.title = cinematic ? "VIANNA — Cinematic" : `VIANNA — ${copy.hero.title}`;
    try { localStorage.setItem("vianna-language", language); } catch { /* Storage is optional. */ }
  }, [copy.lang, copy.hero.title, language, cinematic]);

  return <>
    <main inert={navigationLocked || undefined}>
      <Header language={language} onLanguageChange={setLanguage} copy={copy} cinematic={cinematic} onNavigate={navigate} />
      {cinematic
        ? <CinematicPage language={language} copy={copy} paused={paused} onPlay={setPlayingProject} />
        : <PortfolioPage copy={copy} paused={paused} onPlay={setPlayingProject} />}
    </main>
    {playingProject && <CinemaPlayer project={playingProject} copy={copy.player} onClose={() => setPlayingProject(null)} />}
    <PageTransition transition={transition} />
  </>;
}
