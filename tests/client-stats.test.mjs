import test from "node:test";
import assert from "node:assert/strict";
import { clientChannels } from "../shared/clientChannels.js";
import { getClientStats, clientStatsResponse } from "../server/clientStats.js";
import { validateClientStats } from "../src/clientStats.js";
import worker from "../worker/clients.js";

const payload = () => ({ items: [...clientChannels].reverse().map((client, index) => ({ id: client.channelId, statistics: { subscriberCount: String(100000 + index), hiddenSubscriberCount: false } })) });

test("only MUGM and Tae are requested, together, freshly on each visit", async () => {
  assert.deepEqual(clientChannels.map(client => client.handle), ["MugmV2", "Taejon"]);
  let calls = 0;
  const fetcher = async (url, options) => {
    calls++;
    assert.equal(url.origin, "https://www.googleapis.com");
    assert.equal(url.searchParams.get("id"), clientChannels.map(client => client.channelId).join(","));
    assert.equal(options.cache, "no-store");
    return Response.json(payload());
  };
  const result = await getClientStats("test-key", fetcher);
  assert.equal(result.counts[0].subscribers, 100001);
  assert.equal(result.counts[1].subscribers, 100000);
  assert.deepEqual(validateClientStats(result), result);
  await getClientStats("test-key", fetcher);
  assert.equal(calls, 2);
});

test("missing key and upstream errors return no secrets or fabricated fresh counts", async () => {
  const missing = await clientStatsResponse("");
  assert.equal(missing.status, 503);
  const error = await clientStatsResponse("secret-test", async () => { throw new Error("secret-test"); });
  assert.equal(error.status, 502);
  assert.equal(error.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await error.json(), { error: "temporarily_unavailable" });
});

test("hidden counts remain unavailable instead of becoming zero", async () => {
  const data = payload();
  data.items[0].statistics = { hiddenSubscriberCount: true };
  const result = await getClientStats("test-key", async () => Response.json(data));
  assert.equal(result.counts[1].subscribers, null);
  validateClientStats(result);
});

test("incomplete, negative or invalid counts are rejected", async () => {
  await assert.rejects(getClientStats("test-key", async () => Response.json({ items: [] })));
  const data = payload();
  data.items[0].statistics.subscriberCount = "-1";
  await assert.rejects(getClientStats("test-key", async () => Response.json(data)));
  assert.throws(() => validateClientStats({ checkedAt: "invalid", counts: [] }));
  assert.throws(() => validateClientStats({ checkedAt: new Date().toISOString(), counts: [] }));
});

test("worker rejects unexpected origins and handles preflight without using the API", async () => {
  const rejected = await worker.fetch(new Request("https://example.com/api/clients", { headers: { Origin: "https://unknown.example" } }), {});
  assert.equal(rejected.status, 403);
  const result = await worker.fetch(new Request("https://example.com/api/clients", { method: "OPTIONS", headers: { Origin: "https://www.viannafx.media" } }), {});
  assert.equal(result.status, 204);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), "https://www.viannafx.media");
});

test("worker limits repeated visits before contacting YouTube and fails closed without its binding", async () => {
  const request = new Request("https://example.com/api/clients", { headers: { Origin: "https://www.viannafx.media", "CF-Connecting-IP": "192.0.2.1" } });
  assert.equal((await worker.fetch(request, {})).status, 503);
  const response = await worker.fetch(request, { CLIENTS_RATE_LIMIT: { async limit({ key }) {
    assert.equal(key, "192.0.2.1");
    return { success: false };
  } } });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://www.viannafx.media");
  assert.deepEqual(await response.json(), { error: "too_many_requests" });
});

test("worker uses the YT secret configured in production without exposing it", async t => {
  t.mock.method(globalThis, "fetch", async url => {
    assert.equal(url.searchParams.get("key"), "private-test-key");
    return Response.json(payload());
  });
  const response = await worker.fetch(new Request("https://example.com/api/clients", { headers: { Origin: "https://www.viannafx.media" } }), {
    YT: "private-test-key",
    CLIENTS_RATE_LIMIT: { async limit() { return { success: true }; } },
  });
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(!body.includes("private-test-key"));
  assert.equal(validateClientStats(JSON.parse(body)).counts.length, 2);
});
