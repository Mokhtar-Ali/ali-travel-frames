import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import net from "node:net";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test, { before, after } from "node:test";
import { chromium } from "@playwright/test";
import { loadSource } from "./helpers.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "node_modules/next/dist/bin/next");
const { SITE_URL } = loadSource("lib/seo.ts");
const { getAllPackageSlugs } = loadSource("content/packages/index.ts");
const results = [];
let browser;

before(async () => { browser = await chromium.launch(); });
after(async () => {
  await browser?.close();
  await fs.mkdir(path.join(root, "test-results"), { recursive: true });
  await fs.writeFile(path.join(root, "test-results/indexing-matrix.json"), JSON.stringify(results, null, 2));
});

function environment(values) {
  // Copy only process-launch/font-fetch settings, never repository .env files or tokens.
  const env = { NEXT_TELEMETRY_DISABLED: "1" };
  for (const key of ["PATH", "HOME", "TMPDIR", "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE", "HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY"]) {
    if (process.env[key]) env[key] = process.env[key];
  }
  return { ...env, ...values };
}

async function snapshot() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "atf-indexing-"));
  for (const entry of ["app", "components", "content", "lib", "public", "package.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs", "AGENTS.md", "CLAUDE.md"]) {
    await fs.cp(path.join(root, entry), path.join(directory, entry), { recursive: true });
  }
  await fs.symlink(path.join(root, "node_modules"), path.join(directory, "node_modules"), "dir");
  return directory;
}

function nextProcess(directory, args, env) {
  const child = spawn(process.execPath, [cli, ...args], { cwd: directory, env, detached: true });
  let output = "";
  let readyResolve;
  let readyReject;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  // Build commands do not await readiness; avoid unhandled rejection on a failed build.
  ready.catch(() => {});
  const read = (chunk) => {
    output += chunk.toString();
    if (/Ready in/.test(output)) readyResolve();
  };
  child.stdout.on("data", read);
  child.stderr.on("data", read);
  child.on("error", readyReject);
  const closed = once(child, "close").then(([code]) => {
    readyReject(new Error(`Next.js exited ${code}: ${output}`));
    return code;
  });
  const timeout = setTimeout(() => {
    readyReject(new Error(`Next.js timed out: ${output}`));
    stop();
  }, 180_000);
  function stop() {
    if (child.exitCode === null && child.signalCode === null) {
      try { process.kill(-child.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
    }
  }
  closed.finally(() => clearTimeout(timeout));
  return { ready, closed, stop, output: () => output };
}

async function availablePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function verify(directory, env, noIndex, label, dev = false) {
  const port = await availablePort();
  const server = nextProcess(directory, [dev ? "dev" : "start", ...(dev ? ["--webpack"] : []), "--hostname", "127.0.0.1", "--port", String(port)], env);
  const page = await browser.newPage();
  // Parse inert returned documents only; no application scripts or external traffic.
  await page.route("**/*", (route) => route.abort());
  const evidence = { label, noIndex, pages: [] };
  try {
    await server.ready;
    for (const route of ["/", "/egypt", "/colombia", "/packages", "/packages/medellin-guatape", "/plan", "/plan?c=colombia&package=medellin-guatape&utm_source=matrix"]) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`, {
        redirect: "manual", signal: AbortSignal.timeout(60_000),
        headers: { "User-Agent": "Twitterbot/1.0", "X-Forwarded-Host": "untrusted.invalid" },
      });
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get("x-robots-tag"), noIndex ? "noindex" : null, route);
      const parsed = await page.evaluate((html) => {
        const document = new DOMParser().parseFromString(html, "text/html");
        return {
          canonical: Array.from(document.querySelectorAll('link[rel="canonical"]'), (node) => node.getAttribute("href")),
          robots: Array.from(document.querySelectorAll("meta[name]"), (node) => ({ name: node.getAttribute("name"), content: node.getAttribute("content") }))
            .filter((node) => /^(robots|googlebot|bingbot)$/i.test(node.name)),
          contactNotice: document.body.textContent.includes("online inquiry submissions are unavailable"),
        };
      }, await response.text());
      const pathname = new URL(route, SITE_URL).pathname;
      assert.deepEqual(parsed.canonical, [`${SITE_URL}${pathname === "/" ? "" : pathname}`]);
      assert.deepEqual(parsed.robots, [], "No additional general/bot-specific metadata overrides the universal header");
      if (pathname === "/plan") assert.equal(parsed.contactNotice, true);
      evidence.pages.push({ route, status: response.status, xRobotsTag: response.headers.get("x-robots-tag"), ...parsed });
    }
    const robots = await fetch(`http://127.0.0.1:${port}/robots.txt`);
    const robotsText = await robots.text();
    assert.equal(robots.status, 200);
    assert.ok(robotsText.includes("Allow: /"));
    assert.ok(!robotsText.includes("Disallow: /"));
    assert.ok(robotsText.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
    const sitemap = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    const parsed = await page.evaluate((xml) => {
      const document = new DOMParser().parseFromString(xml, "application/xml");
      return { errors: document.querySelectorAll("parsererror").length,
        urls: Array.from(document.querySelectorAll("url > loc"), (node) => node.textContent),
        dates: document.querySelectorAll("lastmod").length };
    }, await sitemap.text());
    const expected = ["", "/colombia", "/egypt", "/packages", "/about", "/reviews", "/plan", ...getAllPackageSlugs().map((slug) => `/packages/${slug}`)];
    assert.equal(parsed.errors, 0);
    assert.equal(parsed.dates, 0);
    assert.deepEqual(parsed.urls.sort(), expected.map((route) => `${SITE_URL}${route}`).sort());
    const missing = await fetch(`http://127.0.0.1:${port}/packages/not-a-public-package`, { headers: { "User-Agent": "Twitterbot/1.0" } });
    assert.equal(missing.status, 404);
    const excluded = await page.evaluate((html) => {
      const document = new DOMParser().parseFromString(html, "text/html");
      return Array.from(document.querySelectorAll('meta[name="robots"]'), (node) => node.getAttribute("content"));
    }, await missing.text());
    assert.ok(excluded.some((value) => value.split(/,\s*/).includes("noindex")));
    evidence.sitemapCount = parsed.urls.length;
    evidence.excludedStatus = missing.status;
    results.push(evidence);
  } finally {
    await page.close();
    server.stop();
    await server.closed;
  }
}

const cases = [
  { name: "Vercel production", values: { VERCEL: "1", VERCEL_ENV: "production" }, noIndex: false },
  { name: "Vercel preview", values: { VERCEL: "1", VERCEL_ENV: "preview" }, noIndex: true },
  { name: "missing deployment configuration", values: {}, noIndex: false },
  { name: "unknown Vercel environment", values: { VERCEL: "1", VERCEL_ENV: "unknown" }, noIndex: false },
  { name: "explicit local production-build test", values: { ATF_LOCAL_INDEXING_TEST: "1" }, noIndex: true },
];

for (const item of cases) {
  test(`${item.name}: fresh build renders correct headers, canonicals and exclusions`, { timeout: 240_000 }, async () => {
    const directory = await snapshot();
    const env = environment({ NODE_ENV: "production", ...item.values });
    try {
      const build = nextProcess(directory, ["build", "--webpack"], env);
      assert.equal(await build.closed, 0, build.output());
      await verify(directory, env, item.noIndex, item.name);
      if (item.name === "Vercel preview") {
        // Deliberate negative check: runtime environment cannot repair a preview artifact.
        await verify(directory, environment({ NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production" }), true, "preview artifact under production runtime remains noindex; rebuild required");
      }
    } finally {
      await fs.rm(directory, { recursive: true, force: true });
    }
  });
}

test("actual local development server renders noindex without a production build", { timeout: 180_000 }, async () => {
  const directory = await snapshot();
  try {
    await verify(directory, environment({ NODE_ENV: "development" }), true, "local development", true);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
