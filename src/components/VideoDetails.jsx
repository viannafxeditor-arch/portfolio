import { PiSealCheckFill, PiEyeThin, PiCheckCircleFill, PiClock } from "react-icons/pi";
import mugmAvatar from "../assets/clients/mugmv2.jpg";
import taeAvatar from "../assets/clients/taejon.jpg";
const avatars = { MugmV2: mugmAvatar, Taejon: taeAvatar };
const jobsProfile = "https://ytjobs.co/talent/profile/636450";
export function VideoDetails({ project, lang, details }) {
  if (!project.youtubeId || (details && details.id !== project.youtubeId)) return null;
  const label = lang === "pt-BR" ? "visualizações" : lang === "es" ? "visualizaciones" : "views";
  const verified = lang === "en" ? "Verified on YouTube" : lang === "es" ? "Verificado en YouTube" : "Verificado no YouTube";
  const pending = project.ytJobsStatus === "pending";
  const jobsLabel = lang === "pt-BR" ? (pending ? "YT Jobs: verificação pendente" : "Trabalho verificado no YT Jobs") : lang === "es" ? (pending ? "YT Jobs: verificación pendiente" : "Trabajo verificado en YT Jobs") : (pending ? "YT Jobs: verification pending" : "Work verified on YT Jobs");
  const views = details?.views == null ? "—" : new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 }).format(details.views);
  return <div className="video-details" key={project.id} aria-live="polite">
    <img className="video-details__avatar" src={avatars[project.creatorHandle]} alt="" />
    <div className="video-details__body">
      <h3>{details?.title || project.title}</h3>
      <div className="video-details__byline">
        <span className="video-details__creator">{details?.creator || project.creator}{project.youtubeVerified && <PiSealCheckFill role="img" aria-label={verified} />}</span>
        <span aria-hidden="true">·</span>
        <span className="video-details__views" title={details?.views?.toLocaleString(lang)}><PiEyeThin aria-hidden="true" />{views} {label}</span>
        {project.ytJobsStatus && <a className={`video-details__jobs${pending ? " is-pending" : ""}`} href={jobsProfile} target="_blank" rel="noopener noreferrer" title={jobsLabel} aria-label={jobsLabel}>
          {pending ? <PiClock aria-hidden="true" /> : <PiCheckCircleFill aria-hidden="true" />}<span>YT Jobs{pending ? (lang === "en" ? " · Pending" : lang === "es" ? " · Pendiente" : " · Pendente") : ""}</span>
        </a>}
      </div>
    </div>
  </div>;
}
