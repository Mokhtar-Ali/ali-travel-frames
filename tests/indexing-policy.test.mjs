import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./helpers.mjs";

const { getIndexingPolicy } = loadSource("lib/indexing-policy.ts");

test("verified Vercel production retains route indexing and ignores the local test override", () => {
  assert.deepEqual(getIndexingPolicy({ VERCEL: "1", VERCEL_ENV: "production", NODE_ENV: "production", ATF_LOCAL_INDEXING_TEST: "1" }),
    { environment: "production", noIndex: false });
});

test("Vercel preview and development get an all-bot noindex policy", () => {
  for (const value of ["preview", "development"]) {
    assert.deepEqual(getIndexingPolicy({ VERCEL: "1", VERCEL_ENV: value, NODE_ENV: "production" }),
      { environment: value, noIndex: true });
  }
});

test("local development and explicitly identified local production-build tests get noindex", () => {
  for (const env of [{ NODE_ENV: "development" }, { NODE_ENV: "production", ATF_LOCAL_INDEXING_TEST: "1" }]) {
    assert.deepEqual(getIndexingPolicy(env), { environment: "local", noIndex: true });
  }
});

test("missing or unknown hosting identity never silently blocks an existing production deployment", () => {
  for (const env of [{}, { NODE_ENV: "production" }, { VERCEL: "1" },
    { VERCEL: "1", VERCEL_ENV: "unexpected", ATF_LOCAL_INDEXING_TEST: "1" },
    { VERCEL_ENV: "preview", NODE_ENV: "development" },
    { VERCEL: "0", VERCEL_ENV: "preview" }]) {
    assert.deepEqual(getIndexingPolicy(env), { environment: "unknown", noIndex: false });
  }
});

test("server configuration adds exactly one universal directive without host/header-based rules", async () => {
  for (const noIndex of [true, false]) {
    const { default: config } = loadSource("next.config.ts", {
      "./lib/indexing-policy": { getIndexingPolicy: () => ({ noIndex }) },
    });
    assert.deepEqual(await config.headers(), noIndex
      ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]
      : []);
  }
});
