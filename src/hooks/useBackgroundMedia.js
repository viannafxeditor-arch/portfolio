import { useEffect, useState } from "react";
import { selectBackgroundMedia } from "../backgroundMedia.js";
import { backgroundViewport } from "../playbackQuality.js";

const viewportPixels = () => {
  if (typeof window === "undefined") return { width: 1920, height: 1080 };
  return backgroundViewport(window.innerWidth, window.innerHeight);
};

export function useBackgroundMedia(source) {
  const [size, setSize] = useState(viewportPixels);
  useEffect(() => {
    let timer;
    const resize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSize(viewportPixels()), 250);
    };
    window.addEventListener("resize", resize, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("resize", resize); };
  }, []);
  return selectBackgroundMedia(source, size.width, size.height);
}
