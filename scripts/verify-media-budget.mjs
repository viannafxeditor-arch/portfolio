import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync(path.join(root, "deploy/media-manifest.json"), "utf8"));
const budget = 10_000_000_000;
const keys = new Set();
let bytes = 0;
for (const file of manifest.files) {
  assert.ok(file.key.startsWith("media/") && !file.key.includes("\\") && !file.key.split("/").includes(".."), file.key);
  assert.ok(!keys.has(file.key), `Duplicate media: ${file.key}`);
  assert.ok(Number.isSafeInteger(file.bytes) && file.bytes > 0, file.key);
  keys.add(file.key);
  bytes += file.bytes;
}
assert.equal(bytes, manifest.totalBytes, "Manifest total is stale");
assert.ok(bytes < budget, "Media exceeds the 10 GB R2 Standard storage allowance");

if (process.argv.includes("--local")) {
  const publicRoot = path.join(root, "public");
  function verifyDirectory(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) verifyDirectory(file);
      else assert.ok(keys.has(path.relative(publicRoot, file).replaceAll("\\", "/")), `Unlisted file: ${file}`);
    }
  }
  verifyDirectory(path.join(publicRoot, "media"));
  for (const file of manifest.files) assert.equal(statSync(path.join(publicRoot, file.key)).size, file.bytes, file.key);
}
console.log(`${keys.size} media files: ${bytes} bytes. Storage headroom: ${budget - bytes} bytes. Operation quotas apply separately.`);
