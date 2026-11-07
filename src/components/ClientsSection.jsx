import { useEffect, useRef } from "react";
import { clients } from "../clients.js";
import { useClientStats } from "../hooks/useClientStats.js";
import "./clientsSection.css";

const labels = {
  en: { title: "Clients", subtitle: "Channels I’ve edited for.", subscribers: "subscribers", note: "Approximate subscriber counts · Updated", saved: "Last available counts ·", loading: "Updating subscribers…", hidden: "Count unavailable", visit: "Visit channel" },
  "pt-BR": { title: "Clientes", subtitle: "Canais para os quais já editei.", subscribers: "inscritos", note: "Inscritos aproximados · Atualizado em", saved: "Últimas contagens disponíveis ·", loading: "Atualizando inscritos…", hidden: "Contagem indisponível", visit: "Visitar canal" },
  es: { title: "Clientes", subtitle: "Canales para los que he editado.", subscribers: "suscriptores", note: "Suscriptores aproximados · Actualizado el", saved: "Últimos datos disponibles ·", loading: "Actualizando suscriptores…", hidden: "Cantidad no disponible", visit: "Visitar canal" },
};

export function ClientsSection({ lang }) {
  const ref = useRef(null);
  const stats = useClientStats(clients);
  const text = labels[lang] || labels.en;
  const formatter = new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 2 });
  const date = new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(stats.checkedAt));
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("clients-preview")) return;
    const frame = requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: "instant", block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return <section id="clients" ref={ref} className="clients-section" aria-labelledby="clients-title">
    <div className="clients-section__content">
      <header className="clients-section__heading">
        <h2 id="clients-title">{text.title}</h2>
        <p>{text.subtitle}</p>
      </header>
      <ul className="clients-grid">
        {stats.clients.map(client => <li key={client.handle}>
          <a className="client-profile" href={`https://www.youtube.com/@${client.handle}`} target="_blank" rel="noopener noreferrer" aria-label={`${text.visit}: ${client.name}`}>
            <div className="client-profile__portrait"><img src={client.avatar} alt="" width="180" height="180" loading="lazy" decoding="async" /></div>
            <h3>{client.name}</h3>
            <strong>{client.subscribers === null ? "—" : formatter.format(client.subscribers)}</strong>
            <span className="client-profile__caption">{client.subscribers === null ? text.hidden : text.subscribers}</span>
          </a>
        </li>)}
      </ul>
      <p className="clients-section__updated" role="status">{stats.status === "loading" ? text.loading : <>{stats.status === "live" ? text.note : text.saved} <time dateTime={stats.checkedAt}>{date}</time></>}</p>
    </div>
  </section>;
}
