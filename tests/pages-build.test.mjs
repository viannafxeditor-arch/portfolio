import test from "node:test";
import assert from "node:assert/strict";
import { pagesMediaOrigin, rewritePagesMedia } from "../scripts/pages-media.mjs";

test("Pages requires a secure, explicit media origin", () => {
  assert.equal(pagesMediaOrigin("https://media.example.com/"), "https://media.example.com");
  for (const value of ["", "http://media.example.com", "https://user:password@media.example.com", "https://media.example.com/sub", "https://media.example.com/?query"]) {
    assert.throws(() => pagesMediaOrigin(value));
  }
});

test("external media rewrites catalog keys, values and literal sources consistently", () => {
  const code = 'const media = {"/media/clip.mp4": {"src":"/media/clip.mp4"}}; const route = "/cinematic";';
  const result = rewritePagesMedia(code, "https://media.example.com");
  assert.equal(result, 'const media = {"https://media.example.com/media/clip.mp4": {"src":"https://media.example.com/media/clip.mp4"}}; const route = "/cinematic";');
  assert.equal(rewritePagesMedia(result, "https://media.example.com"), result);
});
