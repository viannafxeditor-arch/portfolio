import { PiSealCheckFill, PiEyeThin } from "react-icons/pi";
import mugmAvatar from "../assets/clients/mugmv2.jpg";
export function VideoDetails({ project, lang, details }) {
  if (!project.youtubeId || (details && details.id !== project.youtubeId)) return null;
  const label = lang === "pt-BR" ? "visualizações" : lang === "es" ? "visualizaciones" : "views";
  const verified = lang === "pt-BR" ? "Verificado" : lang === "es" ? "Verificado" : "Verified";
  const views = details?.views == null ? "—" : new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 }).format(details.views);
  return <div className="video-details" key={project.id} aria-live="polite">
    <img className="video-details__avatar" src={mugmAvatar} alt="" />
    <div className="video-details__body">
      <h3>{details?.title || project.title}</h3>
      <div className="video-details__byline">
        <span className="video-details__creator">{details?.creator || "Mugm"}<PiSealCheckFill role="img" aria-label={verified} /></span>
        <span aria-hidden="true">·</span>
        <span className="video-details__views" title={details?.views?.toLocaleString(lang)}><PiEyeThin aria-hidden="true" />{views} {label}</span>
      </div>
    </div>
  </div>;
}

