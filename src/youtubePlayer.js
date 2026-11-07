let apiPromise;

export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement("script");
    let timer;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      window.onYouTubeIframeAPIReady = previous;
      apiPromise = undefined;
      reject(new Error("YouTube unavailable"));
    };
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      resolve(window.YT);
      previous?.();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = fail;
    timer = setTimeout(fail, 15000);
    document.head.append(script);
  });
  return apiPromise;
}

export function youtubePlayerOptions(project, background, origin) {
  return {
    videoId: project.youtubeId,
    host: "https://www.youtube-nocookie.com",
    playerVars: {
      origin, autoplay: 0, playsinline: 1, rel: 0,
      start: project.startSeconds || 0,
      controls: background ? 0 : 1,
      disablekb: background ? 1 : 0,
      ...(background ? { mute: 1, loop: 1, playlist: project.youtubeId } : {}),
    },
  };
}
