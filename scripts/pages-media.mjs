export function pagesMediaOrigin(value) {
  if (!value) throw new Error("Set VITE_MEDIA_ORIGIN to the HTTPS media host before building for GitHub Pages.");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("VITE_MEDIA_ORIGIN must be an HTTPS origin without credentials, paths or query parameters.");
  }
  return url.origin;
}

export function rewritePagesMedia(code, origin) {
  return code.replace(/(["'`])\/media\//g, (_, quote) => `${quote}${origin}/media/`);
}
