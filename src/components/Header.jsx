import { useEffect, useRef, useState } from "react";
import { discordProfileUrl } from "../contact.js";
import { PiCaretDownThin, PiGlobeSimpleThin, PiListThin, PiXThin } from "react-icons/pi";

const languages = ["ENG", "PTBR", "ES"];

export function Header({ language, onLanguageChange, copy, cinematic = false, onNavigate }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const languageRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!languageRef.current?.contains(event.target)) setLanguageOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setNavOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function navigate(event) {
    setNavOpen(false);
    setLanguageOpen(false);
    onNavigate?.(event);
  }

  return (
    <header className="site-header">
      <a className="wordmark" href={`${cinematic ? "/cinematic" : "/"}#home`} onClick={navigate} aria-label={copy.accessibility.home}>
        Vianna
      </a>

      <button
        className="mobile-nav-toggle"
        type="button"
        onClick={() => setNavOpen((value) => !value)}
        aria-expanded={navOpen}
        aria-controls="primary-navigation"
        aria-label={navOpen ? copy.accessibility.closeNavigation : copy.accessibility.openNavigation}
      >
        {navOpen ? <PiXThin aria-hidden="true" /> : <PiListThin aria-hidden="true" />}
      </button>

      <nav id="primary-navigation" className={`primary-nav ${navOpen ? "is-open" : ""}`} aria-label={copy.accessibility.primaryNavigation}>
        <div className="language" ref={languageRef}>
          <button
            className="language__trigger"
            type="button"
            onClick={() => setLanguageOpen((value) => !value)}
            aria-expanded={languageOpen}
            aria-controls="language-options"
            aria-label={copy.accessibility.language}
          >
            <PiGlobeSimpleThin aria-hidden="true" />
            <span>{language}</span>
            <PiCaretDownThin className={languageOpen ? "is-rotated" : ""} aria-hidden="true" />
          </button>

          {languageOpen && (
            <div id="language-options" className="language__menu" role="group" aria-label={copy.accessibility.language}>
              {languages.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={language === item}
                  onClick={() => {
                    onLanguageChange(item);
                    setLanguageOpen(false);
                  }}
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="/" onClick={navigate} aria-current={!cinematic ? "page" : undefined}>{copy.hero.title}</a>
        <a href="/cinematic" onClick={navigate} aria-current={cinematic ? "page" : undefined}>Cinematic</a>
        <a href={`${cinematic ? "/cinematic" : "/"}#about`} onClick={navigate}>{copy.nav.about}</a>
        <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" onClick={navigate}>{copy.nav.contact}</a>
      </nav>
    </header>
  );
}
