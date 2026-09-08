import { useEffect, useState } from "react";
import { selectBackgroundMedia } from "../backgroundMedia.js";

const viewportPixels = () => {
  if (typeof window === "undefined") return { width: 1920, height: 1080 };
  const density = Math.min(window.devicePixelRatio || 1, 2);
  return { width: window.innerWidth * density, height: window.innerHeight * density };
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
