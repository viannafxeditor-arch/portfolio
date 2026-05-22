const navMenu = document.querySelector(".nav-menu");
const navTrigger = document.querySelector(".nav-trigger");
const languageMenu = document.querySelector(".language-menu");
const languageTrigger = document.querySelector(".language-trigger");
const languageCode = document.querySelector(".language-code");

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Me",
    "nav.jobs": "MY JOBS",
    "nav.longForm": "Long-Form",
    "nav.shorts": "Shorts",
    "nav.qa": "Q&A",
    "nav.contact": "Contact",
    "hero.eyebrow": "Video Editor Portfolio",
    "hero.welcome": "Welcome to my editing portfolio. Where creativity meets precision.",
    "about.eyebrow": "About Me",
    "about.title": "Meet Andreas,",
    "about.p1": "I specialize in high-quality video editing with a strong focus on storytelling, retention, sound design, visual impact, and detail. My workflow blends clean cuts, modern transitions, color refinement, motion graphics, and final delivery for every platform.",
    "about.p2": "I have been editing for 6 years and work confidently with Adobe Premiere, After Effects, Sony Vegas, and Media Encoder. Whether the project is a full YouTube episode or a fast vertical short, I keep the edit smooth, clear, and built to hold attention.",
    "timeline.eyebrow": "Process",
    "timeline.title": "A smooth edit timeline",
    "work.eyebrow": "Selected Work",
    "work.longTitle": "Long-Form",
    "work.longCopy": "Horizontal edits with cinematic pacing, strong hooks, and clean visual flow.",
    "shorts.eyebrow": "Vertical Edits",
    "shorts.title": "Shorts",
    "shorts.copy": "Fast vertical cuts made for retention, captions, impact frames, and replay value.",
    "contact.status": "Available For Work",
    "contact.title": "Curious about what we can create together?",
    "faq.eyebrow": "FAQ'S",
    "faq.title": "Answers",
    "faq.copy": "Find answers to common questions about my editing process, services and workflow.",
    "faq.q1": "What services do you provide?",
    "faq.a1": "I edit videos, both long and short, and I can also create thumbnails, but that is not my main focus.",
    "faq.q2": "How do I start working with you?",
    "faq.a2": "We can chat on any of my social media platforms so we can discuss your goals, vision, and how we can bring your project to life.",
    "faq.q3": "What editing tools do you use?",
    "faq.a3": "I work with Adobe Premiere, Adobe After Effects, Adobe Photoshop, Sony Vegas, and Media Encoder.",
    "faq.q4": "How long does a project take?",
    "faq.a4": "It depends on the size and complexity of your video. Longer videos can take 2-7 days, while short videos usually take 1-2 days.",
    "faq.q5": "Do you provide revisions?",
    "faq.a5": "Absolutely. My goal is to deliver the edit you are envisioning, so I offer two revision rounds to refine details and keep the project moving smoothly.",
    "faq.q6": "What is your pricing structure?",
    "faq.a6": "Pricing is handled individually according to complexity, duration, and delivery needs. Send me your idea and we can find an agreement that works for both of us.",
    "footer.brand": "AV Portfolio",
    "footer.rights": "All rights reserved, ©2026"
  },
  pt: {
    "nav.home": "Início",
    "nav.about": "Sobre Mim",
    "nav.jobs": "MEUS TRABALHOS",
    "nav.longForm": "Long-Form",
    "nav.shorts": "Shorts",
    "nav.qa": "Q&A",
    "nav.contact": "Contato",
    "hero.eyebrow": "Portfólio de Editor de Vídeo",
    "hero.welcome": "Bem-vindo ao meu portfólio de edição. Onde criatividade encontra precisão.",
    "about.eyebrow": "Sobre Mim",
    "about.title": "Conheça Andreas,",
    "about.p1": "Sou especializado em edição de vídeo de alta qualidade, com foco em narrativa, retenção, sound design, impacto visual e detalhe. Meu fluxo de trabalho combina cortes limpos, transições modernas, refinamento de cor, motion graphics e entrega final para cada plataforma.",
    "about.p2": "Edito vídeos há 6 anos e trabalho com confiança no Adobe Premiere, After Effects, Sony Vegas e Media Encoder. Seja um episódio completo para YouTube ou um short vertical rápido, mantenho a edição fluida, clara e feita para prender atenção.",
    "timeline.eyebrow": "Processo",
    "timeline.title": "Uma timeline de edição suave",
    "work.eyebrow": "Trabalhos Selecionados",
    "work.longTitle": "Long-Form",
    "work.longCopy": "Edições horizontais com ritmo cinematográfico, hooks fortes e fluxo visual limpo.",
    "shorts.eyebrow": "Edições Verticais",
    "shorts.title": "Shorts",
    "shorts.copy": "Cortes verticais rápidos feitos para retenção, legendas, frames de impacto e replay.",
    "contact.status": "Disponível Para Trabalho",
    "contact.title": "Curioso sobre o que podemos criar juntos?",
    "faq.eyebrow": "FAQ'S",
    "faq.title": "Respostas",
    "faq.copy": "Encontre respostas para dúvidas comuns sobre meu processo de edição, serviços e fluxo de trabalho.",
    "faq.q1": "Quais serviços você oferece?",
    "faq.a1": "Eu edito vídeos longos e curtos, e também posso criar thumbnails, mas esse não é meu foco principal.",
    "faq.q2": "Como começo a trabalhar com você?",
    "faq.a2": "Podemos conversar por qualquer uma das minhas redes sociais para discutir seus objetivos, visão e como podemos dar vida ao seu projeto.",
    "faq.q3": "Quais ferramentas de edição você usa?",
    "faq.a3": "Trabalho com Adobe Premiere, Adobe After Effects, Adobe Photoshop, Sony Vegas e Media Encoder.",
    "faq.q4": "Quanto tempo leva um projeto?",
    "faq.a4": "Depende do tamanho e da complexidade do vídeo. Vídeos longos podem levar de 2 a 7 dias, enquanto vídeos curtos geralmente levam de 1 a 2 dias.",
    "faq.q5": "Você oferece revisões?",
    "faq.a5": "Com certeza. Meu objetivo é entregar a edição que você imaginou, então ofereço duas rodadas de revisão para refinar detalhes e manter o projeto fluindo bem.",
    "faq.q6": "Como funciona sua estrutura de preços?",
    "faq.a6": "Os valores são tratados individualmente conforme a complexidade, duração e necessidades de entrega. Envie sua ideia e podemos encontrar um acordo que funcione para os dois.",
    "footer.brand": "Portfólio AV",
    "footer.rights": "Todos os direitos reservados, ©2026"
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Sobre Mí",
    "nav.jobs": "MIS TRABAJOS",
    "nav.longForm": "Long-Form",
    "nav.shorts": "Shorts",
    "nav.qa": "Q&A",
    "nav.contact": "Contacto",
    "hero.eyebrow": "Portafolio de Editor de Video",
    "hero.welcome": "Bienvenido a mi portafolio de edición. Donde la creatividad se encuentra con la precisión.",
    "about.eyebrow": "Sobre Mí",
    "about.title": "Conoce a Andreas,",
    "about.p1": "Me especializo en edición de video de alta calidad, con un fuerte enfoque en narrativa, retención, diseño sonoro, impacto visual y detalle. Mi flujo de trabajo combina cortes limpios, transiciones modernas, refinamiento de color, motion graphics y entrega final para cada plataforma.",
    "about.p2": "Llevo 6 años editando videos y trabajo con confianza en Adobe Premiere, After Effects, Sony Vegas y Media Encoder. Ya sea un episodio completo para YouTube o un short vertical rápido, mantengo la edición fluida, clara y pensada para retener la atención.",
    "timeline.eyebrow": "Proceso",
    "timeline.title": "Una timeline de edición suave",
    "work.eyebrow": "Trabajos Seleccionados",
    "work.longTitle": "Long-Form",
    "work.longCopy": "Ediciones horizontales con ritmo cinematográfico, hooks fuertes y un flujo visual limpio.",
    "shorts.eyebrow": "Ediciones Verticales",
    "shorts.title": "Shorts",
    "shorts.copy": "Cortes verticales rápidos hechos para retención, subtítulos, frames de impacto y repetición.",
    "contact.status": "Disponible Para Trabajar",
    "contact.title": "¿Tienes curiosidad por lo que podemos crear juntos?",
    "faq.eyebrow": "FAQ'S",
    "faq.title": "Respuestas",
    "faq.copy": "Encuentra respuestas a preguntas comunes sobre mi proceso de edición, servicios y flujo de trabajo.",
    "faq.q1": "¿Qué servicios ofreces?",
    "faq.a1": "Edito videos largos y cortos, y también puedo crear miniaturas, aunque ese no es mi enfoque principal.",
    "faq.q2": "¿Cómo empiezo a trabajar contigo?",
    "faq.a2": "Podemos hablar por cualquiera de mis redes sociales para discutir tus objetivos, visión y cómo podemos dar vida a tu proyecto.",
    "faq.q3": "¿Qué herramientas de edición usas?",
    "faq.a3": "Trabajo con Adobe Premiere, Adobe After Effects, Adobe Photoshop, Sony Vegas y Media Encoder.",
    "faq.q4": "¿Cuánto tarda un proyecto?",
    "faq.a4": "Depende del tamaño y la complejidad del video. Los videos largos pueden tardar de 2 a 7 días, mientras que los videos cortos suelen tardar de 1 a 2 días.",
    "faq.q5": "¿Ofreces revisiones?",
    "faq.a5": "Por supuesto. Mi objetivo es entregar la edición que imaginas, por eso ofrezco dos rondas de revisión para ajustar detalles y mantener el proyecto fluido.",
    "faq.q6": "¿Cómo funciona tu estructura de precios?",
    "faq.a6": "Los precios se manejan individualmente según la complejidad, duración y necesidades de entrega. Envíame tu idea y podemos encontrar un acuerdo que funcione para ambos.",
    "footer.brand": "Portafolio AV",
    "footer.rights": "Todos los derechos reservados, ©2026"
  }
};

function setLanguage(language) {
  const dictionary = translations[language] || translations.en;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  });
  if (languageCode) languageCode.textContent = language.toUpperCase();
  languageMenu?.classList.remove("open");
  languageTrigger?.setAttribute("aria-expanded", "false");
}

function clearLoadingCursor() {
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
  }, 700);
}

if (document.readyState === "complete") {
  clearLoadingCursor();
} else {
  window.addEventListener("load", clearLoadingCursor);
}

navTrigger?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navTrigger.setAttribute("aria-expanded", String(isOpen));
  languageMenu?.classList.remove("open");
  languageTrigger?.setAttribute("aria-expanded", "false");
});

languageTrigger?.addEventListener("click", () => {
  const isOpen = languageMenu.classList.toggle("open");
  languageTrigger.setAttribute("aria-expanded", String(isOpen));
  navMenu?.classList.remove("open");
  navTrigger?.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang || "en");
    button.blur();
    languageTrigger?.blur();
  });
});

document.addEventListener("click", (event) => {
  if (!navMenu?.contains(event.target)) {
    navMenu?.classList.remove("open");
    navTrigger?.setAttribute("aria-expanded", "false");
  }
  if (!languageMenu?.contains(event.target)) {
    languageMenu?.classList.remove("open");
    languageTrigger?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedItem = button.closest(".faq-item");
    const shouldOpen = !selectedItem?.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      const icon = item.querySelector(".faq-icon");
      if (icon) icon.textContent = "+";
    });

    if (selectedItem && shouldOpen) {
      selectedItem.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      const icon = button.querySelector(".faq-icon");
      if (icon) icon.textContent = "x";
    }
  });
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".section-fade").forEach((section) => {
  fadeObserver.observe(section);
});

function startTimelinePlayheadGlow() {
  const timeline = document.querySelector(".editor-timeline");
  const playhead = timeline?.querySelector(".playhead");
  const clips = timeline ? Array.from(timeline.querySelectorAll(".clip")) : [];
  if (!timeline || !playhead || clips.length === 0) return;

  let frameId = 0;
  let isVisible = true;

  function update() {
    frameId = 0;
    if (!isVisible) return;

    const playheadRect = playhead.getBoundingClientRect();
    const playheadX = playheadRect.left + playheadRect.width / 2;

    clips.forEach((clip) => {
      if (clip.closest(".track-row")?.classList.contains("is-disabled")) {
        clip.classList.remove("is-playhead-hit");
        return;
      }

      const rect = clip.getBoundingClientRect();
      const isHit = playheadX >= rect.left && playheadX <= rect.right;
      clip.classList.toggle("is-playhead-hit", isHit);
    });

    frameId = requestAnimationFrame(update);
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting && document.visibilityState !== "hidden";
          if (isVisible && !frameId) frameId = requestAnimationFrame(update);
          if (!isVisible && frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        },
        { threshold: 0.05 }
      )
    : null;

  observer?.observe(timeline);
  document.addEventListener("visibilitychange", () => {
    isVisible = document.visibilityState !== "hidden" && timeline.getBoundingClientRect().bottom > 0;
    if (isVisible && !frameId) frameId = requestAnimationFrame(update);
    if (!isVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  });

  if (!observer) frameId = requestAnimationFrame(update);
}

startTimelinePlayheadGlow();

document.querySelectorAll(".editor-timeline .track-label").forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".track-row");
    if (!row) return;

    const isDisabled = row.classList.toggle("is-disabled");
    button.setAttribute("aria-pressed", String(isDisabled));
    row.querySelectorAll(".clip").forEach((clip) => {
      if (isDisabled) clip.classList.remove("is-playhead-hit");
    });
  });
});

document.querySelectorAll(".carousel-track").forEach((track) => {
  const cards = Array.from(track.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
});

function loadYouTubeCard(card) {
  if (card.dataset.loaded === "true") return;

  const videoId = card.dataset.youtube;
  if (!videoId) return;

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    rel: "0",
    modestbranding: "1"
  });
  if (card.dataset.start) params.set("start", card.dataset.start);

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  iframe.title = card.dataset.title || "YouTube video player";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  iframe.loading = "eager";
  iframe.addEventListener("load", () => card.classList.add("is-loaded"), { once: true });

  card.dataset.loaded = "true";
  card.appendChild(iframe);
}

let youtubeApiPromise;
let modalPlayer;
let modalVolumeRamp;
const videoModal = document.querySelector("#video-modal");
const modalPlayerMount = document.querySelector("#youtube-modal-player");

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

function rampModalVolume(player) {
  if (modalVolumeRamp) window.clearInterval(modalVolumeRamp);

  const startVolume = 10;
  const endVolume = 50;
  const duration = 2600;
  const startedAt = performance.now();

  player.setVolume(startVolume);
  modalVolumeRamp = window.setInterval(() => {
    const progress = Math.min((performance.now() - startedAt) / duration, 1);
    const eased = easeInOut(progress);
    player.setVolume(Math.round(startVolume + (endVolume - startVolume) * eased));
    if (progress >= 1) {
      window.clearInterval(modalVolumeRamp);
      modalVolumeRamp = null;
    }
  }, 80);
}

async function openVideoModal(card) {
  const videoId = card.dataset.youtube;
  if (!videoId || !videoModal || !modalPlayerMount) return;

  videoModal.classList.toggle("is-vertical", card.classList.contains("tall"));
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const YT = await loadYouTubeApi();
  modalPlayer?.destroy?.();
  modalPlayerMount.innerHTML = "";

  const playerTarget = document.createElement("div");
  playerTarget.id = `yt-player-${Date.now()}`;
  modalPlayerMount.appendChild(playerTarget);

  modalPlayer = new YT.Player(playerTarget.id, {
    videoId,
    host: "https://www.youtube.com",
    playerVars: {
      autoplay: 1,
      controls: 1,
      playsinline: 1,
      rel: 0,
      start: Number(card.dataset.start || 0),
      vq: "hd1080"
    },
    events: {
      onReady: (event) => {
        rampModalVolume(event.target);
        event.target.setPlaybackQuality("hd1080");
        event.target.playVideo();
      },
      onPlaybackQualityChange: (event) => {
        if (event.target.getPlaybackQuality() !== "hd1080") {
          event.target.setPlaybackQuality("hd1080");
        }
      }
    }
  });
}

function closeVideoModal() {
  if (modalVolumeRamp) {
    window.clearInterval(modalVolumeRamp);
    modalVolumeRamp = null;
  }
  modalPlayer?.destroy?.();
  modalPlayer = null;
  if (modalPlayerMount) modalPlayerMount.innerHTML = "";
  videoModal?.classList.remove("is-open");
  videoModal?.classList.remove("is-vertical");
  videoModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".youtube-card");
  if (card) {
    event.preventDefault();
    openVideoModal(card);
    return;
  }

  if (event.target === videoModal) {
    closeVideoModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal?.classList.contains("is-open")) {
    closeVideoModal();
  }
});

const youtubeObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadYouTubeCard(entry.target);
          youtubeObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "680px 35%", threshold: 0.01 }
    )
  : null;

document.querySelectorAll(".youtube-card").forEach((card) => {
  if (youtubeObserver) {
    youtubeObserver.observe(card);
  } else {
    loadYouTubeCard(card);
  }
});

const typingWord = document.querySelector("#typing-word");
const typingWords = ["CREATIVITY.", "PRECISION.", "PACING.", "DECOUPAGE.", "VISION."];

function runTypingTitle() {
  if (!typingWord) return;

  const typeSpeed = 210;
  const deleteSpeed = 115;
  const holdTime = 2600;
  const gapTime = 500;
  const cycles = typingWords.map((word) => {
    const typeTime = word.length * typeSpeed;
    const deleteTime = word.length * deleteSpeed;
    return { word, typeTime, deleteTime, totalTime: typeTime + holdTime + deleteTime + gapTime };
  });
  const totalTime = cycles.reduce((sum, cycle) => sum + cycle.totalTime, 0);
  const startedAt = performance.now();

  function render() {
    let elapsed = (performance.now() - startedAt) % totalTime;
    let active = cycles[0];

    for (const cycle of cycles) {
      if (elapsed <= cycle.totalTime) {
        active = cycle;
        break;
      }
      elapsed -= cycle.totalTime;
    }

    let letters = 0;
    if (elapsed <= active.typeTime) {
      letters = Math.max(1, Math.ceil(elapsed / typeSpeed));
    } else if (elapsed <= active.typeTime + holdTime) {
      letters = active.word.length;
    } else if (elapsed <= active.typeTime + holdTime + active.deleteTime) {
      const deleteElapsed = elapsed - active.typeTime - holdTime;
      letters = active.word.length - Math.floor(deleteElapsed / deleteSpeed);
    }

    typingWord.textContent = active.word.slice(0, Math.max(0, letters));
  }

  render();
  window.setInterval(render, 50);
}

runTypingTitle();

const heroBg = document.querySelector("#hero-bg-video");

function startHeroBackground() {
  if (!heroBg) return;

  const ctx = heroBg.getContext("2d");
  if (!ctx) return;
  const startedAt = performance.now();
  let isHeroVisible = true;
  let frameId = 0;

  function resize() {
    const rect = heroBg.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    heroBg.width = Math.max(1, Math.floor(rect.width * dpr));
    heroBg.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function queueDraw() {
    if (!frameId && isHeroVisible) frameId = requestAnimationFrame(draw);
  }

  function draw(now) {
    frameId = 0;
    if (!isHeroVisible) return;

    const width = heroBg.clientWidth;
    const height = heroBg.clientHeight;
    const time = (now - startedAt) / 1000;
    const loopDuration = 15;
    const loop = time % loopDuration;

    ctx.clearRect(0, 0, width, height);

    const targets = getPremiereTargets(width, height);

    if (loop < 7) {
      const playheadProgress = easeInOut(clamp(loop / 7, 0, 1));
      const zoomIn = easeInOut(clamp(loop / 1.6, 0, 1));
      const zoom = 1.15 + zoomIn * 1.85;
      const targetX = targets.timelineStartX + (targets.timelineEndX - targets.timelineStartX) * playheadProgress;
      const targetY = targets.timelineY;
      ctx.save();
      applyCamera(ctx, width, height, targetX, targetY, zoom);
      drawPremiereScene(ctx, width, height, time, playheadProgress);
      ctx.restore();
    } else if (loop < 13) {
      const timerProgress = easeInOut(clamp((loop - 7) / 6, 0, 1));
      const intro = easeInOut(clamp((loop - 7) / 1.2, 0, 1));
      ctx.save();
      applyCamera(ctx, width, height, targets.timerX, targets.timerY, 2.55);
      drawPremiereScene(ctx, width, height, time, timerProgress);
      ctx.restore();
      drawTimelineTimerFocus(ctx, width, height, time, timerProgress, intro);
    } else {
      const fade = easeInOut((loop - 13) / 2);
      ctx.save();
      applyCamera(ctx, width, height, targets.timerX, targets.timerY, 2.55);
      drawPremiereScene(ctx, width, height, time, 1);
      ctx.restore();
      drawTimelineTimerFocus(ctx, width, height, time, 1, 1);
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, width, height);
    }

    queueDraw();
  }

  resize();
  window.addEventListener("resize", resize);

  const heroObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        ([entry]) => {
          isHeroVisible = entry.isIntersecting && document.visibilityState !== "hidden";
          if (!isHeroVisible && frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
          queueDraw();
        },
        { threshold: 0.02 }
      )
    : null;

  heroObserver?.observe(heroBg);
  document.addEventListener("visibilitychange", () => {
    isHeroVisible = document.visibilityState !== "hidden" && (!heroObserver || heroBg.getBoundingClientRect().bottom > 0);
    if (!isHeroVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    queueDraw();
  });
  queueDraw();
}

function drawPremiereScene(ctx, width, height, time, playheadProgress = 0) {
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, width, height);

  const pad = width * 0.065;
  const top = height * 0.13;
  const panelW = width - pad * 2;
  const panelH = height * 0.72;

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  roundRect(ctx, pad, top, panelW, panelH, 10, true, true);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(pad, top, panelW, 46);
  ctx.fillStyle = "rgba(255,255,255,0.56)";
  ctx.font = "600 12px Consolas, monospace";
  ctx.fillText("Sequence: portfolio_edit.prproj - 1920x1080 - 24fps", pad + panelW * 0.34, top + 29);

  drawPropertiesPanel(ctx, pad + 24, top + 70, panelW * 0.28, panelH * 0.34);

  const preview = { x: pad + panelW * 0.46, y: top + 70, w: panelW * 0.46, h: panelH * 0.34 };
  ctx.fillStyle = "#111";
  roundRect(ctx, preview.x, preview.y, preview.w, preview.h, 6, true, true);
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, preview.x, preview.y, preview.w, preview.h, 6, false, false);
  ctx.clip();
  ctx.translate(preview.x, preview.y);
  drawNeutralPreview(ctx, preview.w, preview.h * 0.8, time);
  drawPremierePreviewControls(ctx, preview.w, preview.h, time, playheadProgress);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  roundRect(ctx, preview.x, preview.y, preview.w, preview.h, 6, false, true);

  const timeline = { x: pad + 22, y: top + panelH * 0.55, w: panelW - 44, h: panelH * 0.34 };
  drawTimelinePanel(ctx, timeline, time, playheadProgress);
}

function drawNeutralPreview(ctx, width, height, time) {
  const bg = ctx.createRadialGradient(width * 0.52, height * 0.42, 0, width * 0.52, height * 0.42, width * 0.7);
  bg.addColorStop(0, "#4f4f4f");
  bg.addColorStop(0.48, "#1f1f1f");
  bg.addColorStop(1, "#060606");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const x = (width / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let i = 1; i < 3; i += 1) {
    const y = (height / 3) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const pulse = 0.5 + Math.sin(time * 1.4) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${0.08 + pulse * 0.08})`;
  roundRect(ctx, width * 0.32, height * 0.32, width * 0.36, height * 0.2, 8, true, false);
  ctx.fillStyle = "rgba(255,255,255,0.46)";
  ctx.font = "700 18px Arial, sans-serif";
  ctx.fillText("PREVIEW", width * 0.39, height * 0.45);
}

function drawPropertiesPanel(ctx, x, y, width, height) {
  ctx.fillStyle = "rgba(255,255,255,0.055)";
  roundRect(ctx, x, y, width, height, 6, true, true);
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.font = "700 13px Arial, sans-serif";
  ctx.fillText("Properties", x + 14, y + 24);
  ctx.font = "600 11px Arial, sans-serif";
  ctx.fillText("Transform", x + 18, y + 58);

  const rows = [
    ["Position", "960 X    540 Y"],
    ["Anchor point", "1920 X   1080 Y"],
    ["Scale", "100 %"],
    ["Rotation", "0 deg"],
    ["Opacity", "100 %"],
    ["Crop", "0.0 %"]
  ];
  rows.forEach(([label, value], i) => {
    const rowY = y + 86 + i * 25;
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.fillText(label, x + 20, rowY);
    ctx.fillStyle = "rgba(255,255,255,0.74)";
    ctx.fillText(value, x + width * 0.48, rowY);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.strokeRect(x + width - 26, rowY - 8, 9, 9);
  });
}

function drawPremierePreviewControls(ctx, width, height, time, playheadProgress = 0) {
  const y = height * 0.8;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, y, width, height - y);
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "700 13px Consolas, monospace";
  ctx.fillText(`00:00:${String(Math.floor(playheadProgress * 90)).padStart(2, "0")}:00`, 18, y + 24);
  ctx.fillText("Fit", width * 0.23, y + 24);
  ctx.fillText("Full", width * 0.52, y + 24);
  ctx.fillText("00:01:18:19", width - 120, y + 24);
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(18, y + 52);
  ctx.lineTo(width - 18, y + 52);
  ctx.stroke();
  const playhead = 18 + playheadProgress * (width - 36);
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(playhead - 3, y + 42, 6, 16);
  ["|<", "<", ">", ">|", "+", ">>"].forEach((button, i) => {
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "800 16px Arial, sans-serif";
    ctx.fillText(button, width * 0.24 + i * 44, y + 87);
  });
}

function drawTimelinePanel(ctx, timeline, time, playheadProgress = 0) {
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, timeline.x, timeline.y, timeline.w, timeline.h, 6, false, false);
  ctx.clip();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(timeline.x, timeline.y, timeline.w, timeline.h);
  for (let i = 0; i < 18; i += 1) {
    const x = timeline.x + (timeline.w / 18) * i;
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(x, timeline.y);
    ctx.lineTo(x, timeline.y + timeline.h);
    ctx.stroke();
  }
  ["V3", "V2", "V1", "A2", "A1"].forEach((label, row) => {
    const y = timeline.y + 16 + row * 34;
    ctx.fillStyle = "rgba(255,255,255,0.66)";
    ctx.font = "700 12px Consolas, monospace";
    ctx.fillText(label, timeline.x + 12, y + 15);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.moveTo(timeline.x, y + 26);
    ctx.lineTo(timeline.x + timeline.w, y + 26);
    ctx.stroke();
  });
  const clips = [
    [0.11, 0.2, 0, "INTRO_TITLE"], [0.33, 0.2, 0, "SECTION_CARD"], [0.72, 0.15, 0, "LOWER_THIRD"],
    [0.16, 0.27, 1, "BROLL_01"], [0.45, 0.34, 1, "GAMEPLAY_PREVIEW"], [0.79, 0.14, 1, "REACTION_CUT"],
    [0.09, 0.58, 2, "MAIN_GAMEPLAY_4K"], [0.69, 0.24, 2, "FINAL_SEQUENCE"],
    [0.1, 0.16, 3, "SFX"], [0.33, 0.18, 3, "WHOOSH"], [0.58, 0.24, 3, "DESIGN"],
    [0.09, 0.84, 4, "MUSIC_WAV"]
  ];
  clips.forEach(([x, w, row, label], index) => {
    const clipX = timeline.x + 54 + timeline.w * x;
    const clipY = timeline.y + 22 + row * 34;
    const clipW = timeline.w * w;
    ctx.fillStyle = index % 2 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.28)";
    roundRect(ctx, clipX, clipY, clipW, 20, 3, true, true);
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "700 10px Consolas, monospace";
    ctx.fillText(label, clipX + 8, clipY + 14);
  });
  const playX = timeline.x + 54 + (timeline.w - 74) * clamp(playheadProgress, 0, 1);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(255,255,255,0.7)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(playX, timeline.y);
  ctx.lineTo(playX, timeline.y + timeline.h);
  ctx.stroke();
  ctx.restore();
}

function drawTimelineTimerFocus(ctx, width, height, time, progress = 0, alpha = 1) {
  const p = clamp(progress, 0, 1);
  const seconds = Math.floor(p * 90);
  const frames = Math.floor((p * 90 - seconds) * 24);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const timecode = `00:${String(minutes).padStart(2, "0")}:${String(displaySeconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
  const baseY = height * 0.72;
  const startX = width * 0.14;
  const endX = width * 0.86;
  const playX = startX + (endX - startX) * p;
  const pulse = 0.5 + Math.sin(time * 5.8) * 0.5;

  ctx.save();
  ctx.globalAlpha = alpha;

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.68, 0, width * 0.5, height * 0.68, width * 0.72);
  vignette.addColorStop(0, "rgba(255,255,255,0.09)");
  vignette.addColorStop(0.38, "rgba(0,0,0,0.1)");
  vignette.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(0, height * 0.56, width, height * 0.32);

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.62)";
  ctx.shadowBlur = 24 + pulse * 18;
  ctx.fillStyle = `rgba(255,255,255,${0.76 + pulse * 0.18})`;
  ctx.font = `800 ${Math.max(30, Math.min(72, width * 0.062))}px Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillText(timecode, width * 0.5, height * 0.62);
  ctx.restore();

  ctx.textAlign = "left";
  ctx.font = "700 13px Consolas, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.fillText("TIMELINE TIME", startX, height * 0.62 - 58);
  ctx.fillText("00:01:30:00", endX - 96, baseY - 20);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, baseY);
  ctx.lineTo(endX, baseY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 18; i += 1) {
    const x = startX + ((endX - startX) / 18) * i;
    const tickH = i % 3 === 0 ? 18 : 9;
    ctx.beginPath();
    ctx.moveTo(x, baseY - tickH);
    ctx.lineTo(x, baseY + tickH);
    ctx.stroke();
  }

  const trail = ctx.createLinearGradient(startX, 0, playX, 0);
  trail.addColorStop(0, "rgba(255,255,255,0)");
  trail.addColorStop(0.72, "rgba(255,255,255,0.08)");
  trail.addColorStop(1, "rgba(255,255,255,0.42)");
  ctx.strokeStyle = trail;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(startX, baseY);
  ctx.lineTo(playX, baseY);
  ctx.stroke();

  ctx.shadowColor = "rgba(255,255,255,0.92)";
  ctx.shadowBlur = 20;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(playX, baseY - 84);
  ctx.lineTo(playX, baseY + 60);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(playX, baseY - 92);
  ctx.lineTo(playX - 8, baseY - 76);
  ctx.lineTo(playX + 8, baseY - 76);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function getPremiereTargets(width, height) {
  const pad = width * 0.065;
  const top = height * 0.13;
  const panelW = width - pad * 2;
  const panelH = height * 0.72;
  const timeline = { x: pad + 22, y: top + panelH * 0.55, w: panelW - 44, h: panelH * 0.34 };
  const preview = { x: pad + panelW * 0.46, y: top + 70, w: panelW * 0.46, h: panelH * 0.34 };

  return {
    timelineStartX: timeline.x + 54,
    timelineEndX: timeline.x + timeline.w - 20,
    timelineY: timeline.y + timeline.h * 0.52,
    timerX: timeline.x + timeline.w * 0.5,
    timerY: timeline.y + timeline.h * 0.18,
    previewX: preview.x + preview.w * 0.5,
    previewY: preview.y + preview.h * 0.5
  };
}

function applyCamera(ctx, width, height, targetX, targetY, zoom) {
  ctx.translate(width / 2, height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-targetX, -targetY);
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

startHeroBackground();
