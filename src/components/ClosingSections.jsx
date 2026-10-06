import { PiDiscordLogo, PiEnvelopeSimple, PiXLogo } from "react-icons/pi";
import { discordProfileUrl, contactEmail, xProfileUrl } from "../contact.js";

export function ClosingSections({ copy }) {
  const year = new Date().getFullYear();

  return (
    <section className="closing" aria-label={copy.accessibility.aboutContact}>
      <div id="about" className="closing-copy">
        <h2 className="about-heading">{copy.about.eyebrow}</h2>
        {copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      <div id="contact" className="contact-panel" aria-label={copy.nav.contact}>
        <div className="contact-links">
          <a href={discordProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="Discord" title="Discord"><PiDiscordLogo aria-hidden="true" /></a>
          <a href={`mailto:${contactEmail}`} aria-label={`Email: ${contactEmail}`} title={contactEmail}><PiEnvelopeSimple aria-hidden="true" /></a>
          <a href={xProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="X — ViannaFX" title="X — ViannaFX"><PiXLogo aria-hidden="true" /></a>
        </div>
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
