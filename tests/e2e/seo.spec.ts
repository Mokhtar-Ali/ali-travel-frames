import { test, expect } from "./fixtures";
import { getAllPackages } from "../../content/packages";
import { SITE_DESCRIPTION, SITE_URL } from "../../lib/seo";

const publicPages = [
  { path: "/", title: "Ali Travel Frames | Private Colombia & Egypt Travel Planning", description: SITE_DESCRIPTION },
  { path: "/colombia", title: "Colombia Travel Planning | Ali Travel Frames" },
  { path: "/egypt", title: "Egypt Travel Planning | Ali Travel Frames" },
  { path: "/packages", title: "Colombia Packages & Egypt Travel Planning | Ali Travel Frames" },
  { path: "/about", title: "About Ali, Your Colombia & Egypt Travel Planner | Ali Travel Frames" },
  { path: "/reviews", title: "Colombia & Egypt Traveller Reviews | Ali Travel Frames" },
  { path: "/plan", title: "Plan Your Colombia or Egypt Trip | Ali Travel Frames" },
  ...getAllPackages().map((item) => ({ path: `/packages/${item.slug}`, title: item.title, description: item.metaDescription })),
];

function canonicalUrl(path: string) {
  const pathname = new URL(path, SITE_URL).pathname;
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

test("all public routes render distinct metadata, canonical URLs and real social assets", async ({ page, request, baseURL }) => {
  const titles: string[] = [];
  const checkedImages = new Set<string>();
  for (const item of publicPages) {
    await test.step(item.path, async () => {
      // HTML-limited bots receive blocking head metadata, including dynamic /plan.
      const response = await request.get(item.path, { headers: { "User-Agent": "Twitterbot/1.0" } });
      expect(response.status()).toBe(200);
      const result = await page.evaluate((html) => {
        const document = new DOMParser().parseFromString(html, "text/html");
        const contents = (selector: string, attribute: string) => Array.from(document.querySelectorAll(selector)).map((node) => node.getAttribute(attribute));
        return {
          titles: Array.from(document.querySelectorAll("title")).map((node) => node.textContent),
          canonical: contents('link[rel="canonical"]', "href"),
          description: contents('meta[name="description"]', "content"),
          ogUrl: contents('meta[property="og:url"]', "content"),
          ogImages: contents('meta[property="og:image"]', "content"),
          twitterImages: contents('meta[name="twitter:image"]', "content"),
          robots: contents('meta[name="robots"]', "content"),
          headCanonicalCount: document.head.querySelectorAll('link[rel="canonical"]').length,
        };
      }, await response.text());
      expect(result.titles).toEqual([item.title]);
      titles.push(item.title);
      expect(result.canonical).toEqual([canonicalUrl(item.path)]);
      expect(result.headCanonicalCount).toBe(1);
      expect(result.ogUrl).toEqual(result.canonical);
      expect(result.description).toHaveLength(1);
      expect(result.description[0]!.length).toBeGreaterThan(20);
      if ("description" in item) expect(result.description).toEqual([item.description]);
      expect(result.robots.join(",")).not.toContain("noindex");
      expect(response.headers()["x-robots-tag"] || "").not.toContain("noindex");
      if (item.path === "/egypt") {
        expect(result.ogImages).toEqual([]);
        expect(result.twitterImages).toEqual([]);
      } else {
        expect(result.ogImages).toHaveLength(1);
        expect(result.twitterImages).toEqual(result.ogImages);
      }
      for (const src of result.ogImages) {
        const image = new URL(src!);
        expect(image.origin).toBe(SITE_URL);
        if (!checkedImages.has(src!)) {
          const asset = await request.get(new URL(image.pathname, baseURL).href);
          expect(asset.status()).toBe(200);
          expect(asset.headers()["content-type"]).toMatch(/^image\//);
          checkedImages.add(src!);
        }
      }
    });
  }
  expect(new Set(titles).size).toBe(publicPages.length);
});

test("hydrated representative routes and query variants keep one page-specific canonical", async ({ page }) => {
  for (const path of ["/", "/colombia", "/egypt", "/packages", "/packages/medellin-guatape", "/plan?c=colombia&package=medellin-guatape&utm_source=smoke", "/plan?c=egypt"]) {
    await page.goto(path);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", canonicalUrl(path));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonicalUrl(path));
  }
});

test("sitemap XML parses to exactly the public inventory with no unsupported dates", async ({ request, page }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const parsed = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    return {
      errors: document.querySelectorAll("parsererror").length,
      namespace: document.documentElement.namespaceURI,
      urls: Array.from(document.querySelectorAll("url > loc")).map((node) => node.textContent),
      dates: document.querySelectorAll("lastmod").length,
    };
  }, await response.text());
  expect(parsed.errors).toBe(0);
  expect(parsed.namespace).toBe("http://www.sitemaps.org/schemas/sitemap/0.9");
  expect(parsed.urls.sort()).toEqual(publicPages.map((item) => canonicalUrl(item.path)).sort());
  expect(parsed.urls).toHaveLength(17);
  expect(new Set(parsed.urls).size).toBe(17);
  expect(parsed.urls.filter((url) => new URL(url!).pathname.startsWith("/packages/"))).toHaveLength(getAllPackages().length);
  expect(parsed.dates).toBe(0);
});

test("robots allows crawling and advertises only the production sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toContain("User-Agent: *");
  expect(text).toContain("Allow: /");
  expect(text).not.toContain("Disallow: /");
  expect(text).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  expect(text).not.toMatch(/localhost|127\.0\.0\.1|vercel\.app/);
});

test("missing packages retain the actual not-found output and noindex directive", async ({ request, page }) => {
  const response = await request.get("/packages/not-a-public-package", { headers: { "User-Agent": "Twitterbot/1.0" } });
  expect(response.status()).toBe(404);
  const html = await response.text();
  const output = await page.evaluate((html) => {
    const document = new DOMParser().parseFromString(html, "text/html");
    return { text: document.body.textContent, robots: Array.from(document.querySelectorAll('meta[name="robots"]')).map((node) => node.getAttribute("content")) };
  }, html);
  expect(output.text).toContain("This page is not in the frame");
  expect(output.robots.join(",")).toContain("noindex");
});

test("package text and internal inquiry links remain server-rendered; agency identity stays consistent", async ({ request, page }) => {
  const item = getAllPackages()[0];
  const response = await request.get(`/packages/${item.slug}`);
  const result = await page.evaluate((html) => {
    const document = new DOMParser().parseFromString(html, "text/html");
    return {
      text: document.querySelector("main")!.textContent,
      links: Array.from(document.querySelectorAll('main a')).map((node) => node.getAttribute("href")),
      schema: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent!)),
    };
  }, await response.text());
  expect(result.text).toContain(item.name);
  expect(result.text).toContain(item.summary);
  expect(result.text).toContain(item.itinerary[0].body);
  expect(result.links).toContain(`/plan?c=${item.country}&package=${item.slug}`);
  expect(result.schema).toHaveLength(1);
  expect(result.schema[0]).toMatchObject({ "@type": "TravelAgency", name: "Ali Travel Frames", url: SITE_URL, areaServed: ["Colombia", "Egypt"] });
  expect(result.schema[0]).not.toHaveProperty("aggregateRating");
  expect(result.schema[0]).not.toHaveProperty("address");
});
