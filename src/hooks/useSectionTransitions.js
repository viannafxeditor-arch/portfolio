import { useEffect } from "react";
import { sceneOpacity } from "../sectionTransitions.js";

// Blend full-screen scenes using native scroll progress in either direction.
export function useSectionTransitions(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    const sections = Array.from(root.querySelectorAll(":scope > section"));
    const layers = Array.from(root.querySelectorAll("[data-scene]"));
    const backdrop = root.querySelector(".portfolio-backdrop");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      let blendSoftness = 0;
      const height = window.innerHeight;
      sections.forEach((section, index) => {
        const { top, bottom } = section.getBoundingClientRect();
        const opacity = index === 0 ? 1 : sceneOpacity(top, height, motion.matches);
        layers[index]?.style.setProperty("opacity", String(opacity));
        if (index > 0) blendSoftness = Math.max(blendSoftness, 4 * opacity * (1 - opacity));
        const distance = Math.min(1, Math.max(0, top, height - bottom) / height);
        section.style.setProperty("--content-opacity", motion.matches ? "1" : String(1 - .45 * distance * distance));
      });
      backdrop.style.setProperty("--scene-blur", `${motion.matches ? 0 : (blendSoftness * 4).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, [containerRef]);
}
