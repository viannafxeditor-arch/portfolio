import { loadEnv } from "vite";
import { clientStatsResponse } from "../server/clientStats.js";

export function clientsApiPlugin() {
  let root, mode;
  const configure = server => {
    server.middlewares.use(async (request, response, next) => {
      if (new URL(request.url, "http://localhost").pathname !== "/api/clients") return next();
      if (request.method !== "GET") { response.writeHead(405, { Allow: "GET" }); response.end(); return; }
      // Server-only variable: never use a VITE_ prefix for the secret.
      const key = process.env.YOUTUBE_API_KEY || loadEnv(mode, root, "YOUTUBE_").YOUTUBE_API_KEY;
      const result = await clientStatsResponse(key);
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(await result.text());
    });
  };
  return {
    name: "local-clients-api",
    configResolved(config) { root = config.root; mode = config.mode; },
    configureServer: configure,
    configurePreviewServer: configure,
  };
}
