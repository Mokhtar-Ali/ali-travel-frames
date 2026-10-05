import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./helpers.mjs";

test("metadata uses the configured origin and drops query and fragment variants", () => {
  const { buildMetadata, SITE_URL } = loadSource("lib/seo.ts");
  for (const path of ["/plan?c=egypt&package=unknown#contact", "plan?utm_source=test"]) {
    const metadata = buildMetadata({ title: "Plan", path });
    assert.equal(metadata.metadataBase.href, `${SITE_URL}/`);
    assert.equal(metadata.alternates.canonical, "/plan");
    assert.equal(metadata.openGraph.url, "/plan");
  }
});

test("social metadata references existing assets, or omits images without blocking metadata", () => {
  const { buildMetadata } = loadSource("lib/seo.ts");
  for (const image of [null, "/egypt/hero-1.jpg", "/missing-social.jpg"]) {
    const metadata = buildMetadata({ image });
    assert.equal(metadata.openGraph.images, undefined);
    assert.equal(metadata.twitter.images, undefined);
    assert.equal(metadata.twitter.card, "summary");
  }
  const metadata = buildMetadata({ image: "/hero/01-cartagena.jpg" });
  assert.equal(metadata.openGraph.images[0].url, "/hero/01-cartagena.jpg");
  assert.deepEqual(metadata.twitter.images, ["/hero/01-cartagena.jpg"]);
  assert.equal(metadata.openGraph.images[0].width, undefined);
  assert.equal(metadata.twitter.card, "summary_large_image");
});

test("every public package derives metadata from the rendering registry", async () => {
  const { getAllPackages, egyptPackages } = loadSource("content/packages/index.ts");
  const { generateMetadata } = loadSource("app/packages/[slug]/page.tsx");
  const packages = getAllPackages();
  assert.equal(packages.length, 10);
  assert.equal(egyptPackages.length, 0);
  for (const item of packages) {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: item.slug }) });
    assert.equal(metadata.title, item.title);
    assert.equal(metadata.description, item.metaDescription);
    assert.equal(metadata.alternates.canonical, `/packages/${item.slug}`);
    assert.equal(metadata.openGraph.images[0].url, item.heroImage);
  }
});

test("image-free package metadata remains valid and is not marked noindex", async () => {
  const { generateMetadata } = loadSource("app/packages/[slug]/page.tsx", {
    "@/lib/public-assets": { publicAssetExists: () => false },
  });
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "medellin-guatape" }) });
  assert.equal(metadata.alternates.canonical, "/packages/medellin-guatape");
  assert.equal(metadata.openGraph.images, undefined);
  assert.equal(metadata.twitter.images, undefined);
  assert.equal(metadata.robots, undefined);
});

test("unknown packages retain noindex metadata and the notFound branch", async () => {
  const notFoundError = new Error("controlled notFound");
  const { generateMetadata, default: Page } = loadSource("app/packages/[slug]/page.tsx", {
    "next/navigation": { notFound() { throw notFoundError; } },
  });
  const props = { params: Promise.resolve({ slug: "not-a-public-package" }) };
  assert.deepEqual((await generateMetadata(props)).robots, { index: false, follow: false });
  await assert.rejects(Page(props), (error) => error === notFoundError);
});

test("sitemap contains only public canonical pages and registry packages, without guessed dates", () => {
  const { default: sitemap } = loadSource("app/sitemap.ts");
  const { getAllPackageSlugs } = loadSource("content/packages/index.ts");
  const { SITE_URL } = loadSource("lib/seo.ts");
  const expected = ["/", "/colombia", "/egypt", "/packages", "/reviews", "/about", "/plan",
    ...getAllPackageSlugs().map((slug) => `/packages/${slug}`)];
  const entries = sitemap();
  assert.equal(entries.length, 17);
  assert.deepEqual(entries.map((entry) => entry.url).sort(), expected.map((path) => `${SITE_URL}${path === "/" ? "" : path}`).sort());
  for (const entry of entries) {
    assert.deepEqual(Object.keys(entry), ["url"]);
    assert.equal(new URL(entry.url).search, "");
  }
  const imageFreeSitemap = loadSource("app/sitemap.ts", {
    "@/lib/public-assets": { publicAssetExists: () => false },
  }).default;
  assert.deepEqual(imageFreeSitemap(), entries);
});

test("robots remains crawlable and references the configured canonical sitemap", () => {
  const { default: robots } = loadSource("app/robots.ts");
  const { SITE_URL } = loadSource("lib/seo.ts");
  assert.deepEqual(robots(), { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` });
});
