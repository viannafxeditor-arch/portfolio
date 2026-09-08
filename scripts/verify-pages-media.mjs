import { readFileSync } from "node:fs";
import { pagesMediaOrigin } from "./pages-media.mjs";
const origin = pagesMediaOrigin(process.env.VITE_MEDIA_ORIGIN);
const { files } = JSON.parse(readFileSync(new URL("../deploy/media-manifest.json", import.meta.url), "utf8"));
let index = 0;
const failures = [];
async function verify() {
  while (index < files.length) {
    const file = files[index++];
    try {
      const response = await fetch(`${origin}/${file.key}`, { method: "HEAD", signal: AbortSignal.timeout(30000) });
      if (!response.ok || Number(response.headers.get("content-length")) !== file.bytes) failures.push(file.key);
    } catch { failures.push(file.key); }
  }
}
await Promise.all(Array.from({ length: 6 }, verify));
if (failures.length) throw new Error(`Media upload incomplete or unavailable: ${failures.join(", ")}`);
console.log(`Verified ${files.length} public media assets before deployment.`);
