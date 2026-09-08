import { PiArrowRightThin } from "react-icons/pi";
import { discordProfileUrl } from "../contact.js";

export function ClosingSections({ copy }) {
  const year = new Date().getFullYear();

  return (
    <section className="closing" aria-label={copy.accessibility.aboutContact}>
      <div id="about" className="closing-copy">
        <div className="eyebrow"><span>{copy.about.eyebrow}</span><i aria-hidden="true" /></div>
        {copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      <div id="contact" className="contact-panel" aria-label={copy.nav.contact}>
        <a className="contact-cta" href={discordProfileUrl} target="_blank" rel="noopener noreferrer">
          <span>{copy.contact.cta}</span>
          <PiArrowRightThin aria-hidden="true" />
        </a>
      </div>

      <div className="portrait-panel">
        <img src="/media/andreas-portrait.png" alt={copy.accessibility.portraitAlt} loading="lazy" decoding="async" />
      </div>

      <footer>
        <span>© {year} {copy.footer.copyright}</span>
        <span>{copy.footer.rights}</span>
      </footer>
    </section>
  );
}
