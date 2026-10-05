import { useEffect } from "react";

// Blend full-screen scenes using native scroll progress in either direction.
export function useSectionTransitions(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    const sections = Array.from(root.querySelectorAll(":scope > section"));
    const layers = Array.from(root.querySelectorAll("[data-scene]"));
    const backdrop = root.querySelector(".portfolio-backdrop");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let initial = true;
    const values = layers.map((_, index) => index === 0 ? 1 : 0);
    const update = (time = performance.now()) => {
      frame = 0;
      const smoothing = 1 - Math.exp(-Math.min(64, lastTime ? time - lastTime : 16) / 150);
      lastTime = time;
      let unsettled = false;
      let blendSoftness = 0;
      const height = window.innerHeight;
      sections.forEach((section, index) => {
        const { top, bottom } = section.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, 1 - top / height));
        const mix = fraction * fraction * (3 - 2 * fraction);
        const opacity = index === 0 ? 1 : motion.matches ? Number(fraction >= .5) : mix;
        const value = initial || motion.matches ? opacity : values[index] + (opacity - values[index]) * smoothing;
        values[index] = Math.abs(value - opacity) < .001 ? opacity : value;
        unsettled ||= values[index] !== opacity;
        layers[index]?.style.setProperty("opacity", String(values[index]));
        if (index > 0) blendSoftness = Math.max(blendSoftness, 4 * values[index] * (1 - values[index]));
        const distance = Math.min(1, Math.max(0, top, height - bottom) / height);
        section.style.setProperty("--content-opacity", motion.matches ? "1" : String(1 - .45 * distance * distance));
      });
      backdrop.style.setProperty("--scene-blur", `${motion.matches ? 0 : (blendSoftness * 4).toFixed(2)}px`);
      initial = false;
      if (unsettled) frame = requestAnimationFrame(update);
      else lastTime = 0;
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
