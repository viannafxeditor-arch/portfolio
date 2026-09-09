import additionalMedia from "./additionalMedia.json" with { type: "json" };

const makeProject = (id, year, thumb, poster, videoSrc = null, sourceFilename = null) => ({
  id,
  year,
  thumb,
  poster,
  videoSrc,
  sourceFilename,
});

export function projectDisplayTitle(project, fallback) {
  return project.displayTitle || (project.sourceFilename ? project.sourceFilename.replace(/\.[^.]+$/, "") : fallback);
}

export const workSections = [
  {
    id: "youtube",
    projects: [
      makeProject("youtube-01", "", "/media/youtube-frame.jpg", "/media/youtube-frame.jpg", "/media/youtube-loop.mp4", "TimeLine.mp4"),
      makeProject("youtube-02", "", "/media/content-warning-poster.jpg", "/media/content-warning-poster.jpg", "/media/content-warning-loop.mp4", "⛔️ CONTENT WARNING NÃO FOI FEITO PRA GENTE!.mkv"),
      makeProject("youtube-03", "", "/media/lethal-company-poster.jpg", "/media/lethal-company-poster.jpg", "/media/lethal-company-loop.mp4", "CLIPES DE LETHAL COMPANY QUE NÃO FORAM COMBINADOS!.mkv"),
      makeProject("youtube-04", "", "/media/lol-poster.jpg", "/media/lol-poster.jpg", "/media/lol-loop.webm", "LOL É UM JOGO QUE [NÃO] DEVERIA EXISTIR 🚫.webm"),
    ].map(project => ({ ...project, format: "long-form" })).concat(additionalMedia.shorts),
  },
  {
    id: "documentary",
    projects: [makeProject("documentary-01", "", "/media/home-frame.jpg", "/media/home-frame.jpg", "/media/home-loop.mp4", "Timeline 1.mp4")],
  },
 ].map(section => {
  const counts = {};
  return { ...section, projects: section.projects.map(project => {
    const group = project.format || section.id;
    const sequence = counts[group] = (counts[group] || 0) + 1;
    const label = group === "shorts" ? "Short" : group === "long-form" ? "Long-Form" : "Documentary";
    return { ...project, sequence, displayTitle: `${label} · ${String(sequence).padStart(2, "0")}` };
  }) };
});

export const siteCopy = {
  ENG: {
    lang: "en",
    nav: { work: "Work", about: "About", contact: "Contact" },
    accessibility: {
      home: "Vianna home",
      openNavigation: "Open navigation",
      closeNavigation: "Close navigation",
      primaryNavigation: "Primary navigation",
      language: "Language",
      introduction: "Introduction",
      scrollToWork: "Explore videos",
      soundOn: "Turn sound on",
      soundOff: "Mute sound",
      play: "Play",
      projects: "projects",
      showMore: "Show more",
      returnFirst: "Return to the first",
      aboutContact: "About and contact",
      portraitAlt: "Portrait of Vianna",
    },
    hero: { title: "Portfolio", scroll: "Scroll to explore" },
    player: { close: "Close player", play: "Play", pause: "Pause", back: "Back 5 seconds", forward: "Forward 5 seconds", mute: "Mute", unmute: "Unmute", volume: "Volume", seek: "Playback position", quality: "Quality", original: "Original", fullscreen: "Full screen", exitFullscreen: "Exit full screen", unavailable: "This video is not available yet.", error: "Unable to load this video.", retry: "Try again", loading: "Loading video…" },
    library: { empty: "Videos coming soon", format: "Video format" },
    work: {
      youtube: {
        title: "YouTube",
        tagline: "Storytelling engineered for attention.",
      },
      documentary: {
        title: "Documentary",
        tagline: "Turning information into narrative.",
      },
    },
    about: {
      eyebrow: "About me",
      title: "Stories shape how we see.",
      paragraphs: [
        "I’m a video editor focused on storytelling, rhythm, and audience connection.",
        "My approach combines creative editing with principles from Media Psychology, including attention, perception, emotion, pacing, narrative structure, and retention.",
        "Every cut has a purpose: to build tension, create impact, give a moment space, or guide attention. I edit to make stories felt, understood, and remembered.",
      ],
    },
    contact: {
      eyebrow: "Let’s work together",
      title: "Have a project in mind?",
      cta: "Get in touch",
      email: "hello@viannavisuals.com",
      instagram: "@viannavisuals",
      location: "São Paulo, Brazil",
    },
    footer: { copyright: "Vianna Visuals", rights: "All rights reserved" },
  },
  PTBR: {
    lang: "pt-BR",
    nav: { work: "Trabalhos", about: "Sobre", contact: "Contato" },
    accessibility: {
      home: "Início Vianna",
      openNavigation: "Abrir navegação",
      closeNavigation: "Fechar navegação",
      primaryNavigation: "Navegação principal",
      language: "Idioma",
      introduction: "Introdução",
      scrollToWork: "Explorar vídeos",
      soundOn: "Ativar som",
      soundOff: "Silenciar",
      play: "Reproduzir",
      projects: "projetos",
      showMore: "Mostrar mais",
      returnFirst: "Voltar aos primeiros",
      aboutContact: "Sobre e contato",
      portraitAlt: "Retrato de Vianna",
    },
    hero: { title: "Portfólio", scroll: "Role para explorar" },
    player: { close: "Fechar player", play: "Reproduzir", pause: "Pausar", back: "Voltar 5 segundos", forward: "Avançar 5 segundos", mute: "Silenciar", unmute: "Ativar som", volume: "Volume", seek: "Posição da reprodução", quality: "Qualidade", original: "Original", fullscreen: "Tela cheia", exitFullscreen: "Sair da tela cheia", unavailable: "Este vídeo ainda não está disponível.", error: "Não foi possível carregar este vídeo.", retry: "Tentar novamente", loading: "Carregando vídeo…" },
    library: { empty: "Vídeos em breve", format: "Formato de vídeo" },
    work: {
      youtube: {
        title: "YouTube",
        tagline: "Narrativas pensadas para prender a atenção.",
      },
      documentary: {
        title: "Documentário",
        tagline: "Transformando informação em narrativa.",
      },
    },
    about: {
      eyebrow: "Sobre mim",
      title: "Histórias moldam a forma como vemos.",
      paragraphs: [
        "Sou editor de vídeo focado em narrativa, ritmo e conexão com o público.",
        "Minha abordagem combina edição criativa com princípios da Psicologia da Mídia, como atenção, percepção, emoção, ritmo, estrutura narrativa e retenção.",
        "Cada corte tem um propósito: criar tensão, gerar impacto, dar espaço a um momento ou guiar a atenção. Edito para que histórias sejam sentidas, compreendidas e lembradas.",
      ],
    },
    contact: {
      eyebrow: "Vamos trabalhar juntos",
      title: "Tem um projeto em mente?",
      cta: "Entrar em contato",
      email: "hello@viannavisuals.com",
      instagram: "@viannavisuals",
      location: "São Paulo, Brasil",
    },
    footer: { copyright: "Vianna Visuals", rights: "Todos os direitos reservados" },
  },
  ES: {
    lang: "es",
    nav: { work: "Proyectos", about: "Sobre mí", contact: "Contacto" },
    accessibility: {
      home: "Inicio de Vianna",
      openNavigation: "Abrir navegación",
      closeNavigation: "Cerrar navegación",
      primaryNavigation: "Navegación principal",
      language: "Idioma",
      introduction: "Introducción",
      scrollToWork: "Explorar videos",
      soundOn: "Activar sonido",
      soundOff: "Silenciar",
      play: "Reproducir",
      projects: "proyectos",
      showMore: "Mostrar más",
      returnFirst: "Volver a los primeros",
      aboutContact: "Sobre mí y contacto",
      portraitAlt: "Retrato de Vianna",
    },
    hero: { title: "Portafolio", scroll: "Desplázate para explorar" },
    player: { close: "Cerrar reproductor", play: "Reproducir", pause: "Pausar", back: "Retroceder 5 segundos", forward: "Avanzar 5 segundos", mute: "Silenciar", unmute: "Activar sonido", volume: "Volumen", seek: "Posición de reproducción", quality: "Calidad", original: "Original", fullscreen: "Pantalla completa", exitFullscreen: "Salir de pantalla completa", unavailable: "Este video aún no está disponible.", error: "No se pudo cargar este video.", retry: "Intentar de nuevo", loading: "Cargando video…" },
    library: { empty: "Videos próximamente", format: "Formato de video" },
    work: {
      youtube: {
        title: "YouTube",
        tagline: "Narrativas diseñadas para captar la atención.",
      },
      documentary: {
        title: "Documental",
        tagline: "Transformando información en narrativa.",
      },
    },
    about: {
      eyebrow: "Sobre mí",
      title: "Las historias moldean nuestra mirada.",
      paragraphs: [
        "Soy editor de video especializado en narrativa, ritmo y conexión con la audiencia.",
        "Mi enfoque combina la edición creativa con principios de Psicología de los Medios, como atención, percepción, emoción, ritmo, estructura narrativa y retención.",
        "Cada corte tiene un propósito: crear tensión, generar impacto, dar espacio a un momento o guiar la atención. Edito para que las historias se sientan, se comprendan y se recuerden.",
      ],
    },
    contact: {
      eyebrow: "Trabajemos juntos",
      title: "¿Tienes un proyecto en mente?",
      cta: "Hablemos",
      email: "hello@viannavisuals.com",
      instagram: "@viannavisuals",
      location: "São Paulo, Brasil",
    },
    footer: { copyright: "Vianna Visuals", rights: "Todos los derechos reservados" },
  },
};
