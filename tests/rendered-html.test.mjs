import assert from "node:assert/strict";
import test from "node:test";

test("renders production Atlas metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>ATLAS — The emotional geography of cities<\/title>/i);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
});

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  return { status: response.status, html: await response.text() };
}

test("serves every view as a real, shareable URL", async () => {
  for (const path of ["/explore", "/explore?region=Europe", "/compare", "/discover", "/favorites"]) {
    const { status } = await render(path);
    assert.equal(status, 200, path);
  }
  const city = await render("/city/tokyo");
  assert.equal(city.status, 200);
  assert.match(city.html, /<title>Tokyo, Japan — ATLAS<\/title>/);
  assert.match(city.html, /TOKYO/);
});

test("returns 404 for unknown cities and pages", async () => {
  for (const path of ["/city/atlantis", "/nowhere"]) {
    const { status, html } = await render(path);
    assert.equal(status, 404, path);
    assert.match(html, /isn(&#x27;|')t on the map/);
  }
});
