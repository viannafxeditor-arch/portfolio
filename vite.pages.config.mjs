import { defineConfig, loadEnv } from "vite";
import config from "./vite.config.mjs";
import { pagesMediaOrigin, rewritePagesMedia } from "./scripts/pages-media.mjs";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const origin = pagesMediaOrigin(env.VITE_MEDIA_ORIGIN);
  return {
    ...config,
    publicDir: false,
    build: { ...config.build, outDir: "dist/pages" },
    plugins: [...config.plugins, {
      name: "pages-external-media",
      enforce: "pre",
      transform(code, id) {
        if (!id.replaceAll("\\", "/").includes("/src/")) return null;
        const transformed = rewritePagesMedia(code, origin);
        return transformed === code ? null : { code: transformed, map: null };
      },
    }],
  };
});
