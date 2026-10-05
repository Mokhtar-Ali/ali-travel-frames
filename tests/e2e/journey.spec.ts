import { test, expect, noHorizontalOverflow, keyboardFocus, screenshot, contactState } from "./fixtures";
import { colombiaPackages, egyptPackages } from "../../content/packages";
import { hero, heroSlides, whatsappContactUrl } from "../../content/site";

const selected = colombiaPackages[0];
const selectedQuery = `c=${selected.country}&package=${selected.slug}`;

test("header navigation and homepage planning action work with keyboard and mobile menu", async ({ page }, testInfo) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const toggle = header.getByRole("button", { name: "Open navigation menu", exact: true });
  const compact = testInfo.project.use.viewport!.width < 900;
  for (const [label, path] of [["Colombia", "/colombia"], ["Egypt", "/egypt"], ["About", "/about"], ["Reviews", "/reviews"]]) {
    if (compact) {
      await keyboardFocus(toggle, page);
      await toggle.press("Enter");
      await expect(header.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
      await screenshot(page, testInfo, `navigation-${label.toLowerCase()}`);
    }
    const nav = compact ? header.locator("#site-mobile-menu") : header.getByRole("navigation", { name: "Primary navigation" });
    const link = nav.getByRole("link", { name: label, exact: true });
    await keyboardFocus(link, page);
    await link.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
    if (compact) await expect(header.locator("#site-mobile-menu")).toBeHidden();
    await noHorizontalOverflow(page);
  }
  await header.getByRole("link", { name: "Ali Travel Frames home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.locator(".home-hero").getByRole("link", { name: "Book a call", exact: true }).click();
  await expect(page).toHaveURL(/\/plan$/);
  await contactState(page);
});

test("homepage carousel reaches every Colombia package, both ends and correct detail routes", async ({ page }, testInfo) => {
  await page.goto("/");
  const track = page.locator("#package-carousel-colombia");
  const cards = track.getByRole("link");
  const previous = page.getByRole("button", { name: "Previous Colombia journeys", exact: true });
  const next = page.getByRole("button", { name: "Next Colombia journeys", exact: true });
  const controlsSettled = () => expect.poll(() => track.evaluate((element) => {
    const buttons = element.closest(".package-carousel")!.querySelectorAll("button");
    return buttons[0].disabled === (element.scrollLeft <= 1) &&
      buttons[1].disabled === (element.scrollLeft + element.clientWidth >= element.scrollWidth - 1);
  }), { message: "Controls reflect the completed browser scroll" }).toBe(true);
  await expect(cards).toHaveCount(colombiaPackages.length);
  expect(await cards.evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).pathname)))
    .toEqual(colombiaPackages.map((item) => `/packages/${item.slug}`));
  await track.scrollIntoViewIfNeeded();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await keyboardFocus(next, page);
  await screenshot(page, testInfo, "colombia-carousel-first");
  const reached = new Set<string>();
  for (let step = 0; step <= colombiaPackages.length; step++) {
    const visible = await track.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return Array.from(element.querySelectorAll<HTMLAnchorElement>("a")).filter((link) => {
        const card = link.getBoundingClientRect();
        return card.left >= bounds.left - 1 && card.right <= bounds.right + 1;
      }).map((link) => new URL(link.href).pathname);
    });
    visible.forEach((path) => reached.add(path));
    await noHorizontalOverflow(page);
    if (await next.isDisabled()) break;
    expect(step, "Carousel failed to reach its end within one pass").toBeLessThan(colombiaPackages.length);
    const before = await track.evaluate((element) => element.scrollLeft);
    await next.press(step % 2 ? "Space" : "Enter");
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before + 1);
    await expect.poll(() => track.evaluate((element) => {
      const card = element.querySelector("a");
      const step = card!.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
      const end = element.scrollWidth - element.clientWidth;
      return Math.min(Math.abs(element.scrollLeft - end), Math.abs(element.scrollLeft / step - Math.round(element.scrollLeft / step)));
    })).toBeLessThan(0.05);
    await controlsSettled();
  }
  expect([...reached].sort()).toEqual(colombiaPackages.map((item) => `/packages/${item.slug}`).sort());
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();
  await screenshot(page, testInfo, "colombia-carousel-last");
  for (let step = 0; step < colombiaPackages.length && await previous.isEnabled(); step++) {
    const before = await track.evaluate((element) => element.scrollLeft);
    await previous.press("Enter");
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(before - 1);
    await controlsSettled();
  }
  await expect(previous).toBeDisabled();
  await track.locator(`a[href="/packages/${selected.slug}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/packages/${selected.slug}$`));
  await expect(page.getByRole("heading", { level: 1, name: selected.name, exact: true })).toBeVisible();
  await page.goBack();
  await expect(next).toBeEnabled();
  for (let step = 0; step < colombiaPackages.length && await next.isEnabled(); step++) {
    const before = await track.evaluate((element) => element.scrollLeft);
    await next.press("Enter");
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before + 1);
    await controlsSettled();
  }
  await expect(next).toBeDisabled();
  const last = colombiaPackages[colombiaPackages.length - 1];
  await track.locator(`a[href="/packages/${last.slug}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/packages/${last.slug}$`));
  await expect(page.getByRole("heading", { level: 1, name: last.name, exact: true })).toBeVisible();
});

test("Colombia grid agrees with the registry and package inquiry carries canonical context", async ({ page }, testInfo) => {
  await page.goto("/colombia");
  const grid = page.locator(".country-package-grid");
  await expect(grid.getByRole("link")).toHaveCount(colombiaPackages.length);
  expect(await grid.getByRole("link").evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).pathname)))
    .toEqual(colombiaPackages.map((item) => `/packages/${item.slug}`));
  await grid.locator(`a[href="/packages/${selected.slug}"]`).click();
  await expect(page.getByRole("heading", { level: 1, name: selected.name, exact: true })).toBeVisible();
  await noHorizontalOverflow(page);
  const cta = page.getByRole("link", { name: "Book a free 15-minute call", exact: true });
  await expect(cta).toHaveAttribute("href", `/plan?${selectedQuery}`);
  await cta.click();
  await expect(page).toHaveURL(new RegExp(`/plan\\?${selectedQuery}$`));
  await contactState(page);
  await expect(page.getByRole("main").getByText(selected.name, { exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByText("Destination: Colombia", { exact: true })).toBeVisible();
  await screenshot(page, testInfo, "plan-selected");
  await page.locator("[aria-labelledby=plan-contact-title]").screenshot({ path: testInfo.outputPath("plan-selected-contact.png") });
  await page.getByRole("link", { name: "Clear selected journey", exact: true }).click();
  await expect(page).toHaveURL(/\/plan\?c=colombia$/);
  await contactState(page);
  await expect(page.getByText("Selected journey", { exact: true })).toHaveCount(0);
});

test("Colombia content stays within the viewport including the guide", async ({ page }, testInfo) => {
  await page.goto("/colombia");
  const measurements = await page.getByRole("main").evaluate((main) =>
    Array.from(main.querySelectorAll<HTMLElement>("*")).map((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { tag: element.tagName, class: element.className, left: box.left, right: box.right, width: box.width, minWidth: style.minWidth };
    }).filter((box) => box.right > document.documentElement.clientWidth + 1 || box.left < -1),
  );
  await testInfo.attach("content-bounds", { contentType: "application/json", body: Buffer.from(JSON.stringify(measurements, null, 2)) });
  const regions = await page.locator(".region-card").evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, top: bounds.top };
  }));
  for (let index = 1; index < regions.length; index++) {
    if (Math.abs(regions[index].top - regions[index - 1].top) < 1) {
      expect(regions[index - 1].right, "Region cards must not overlap adjacent grid columns").toBeLessThanOrEqual(regions[index].left);
    }
  }
  await page.getByRole("heading", { name: "Five places to begin", exact: true }).scrollIntoViewIfNeeded();
  await screenshot(page, testInfo, "colombia-regions");
  await page.locator(".guide-section").scrollIntoViewIfNeeded();
  await screenshot(page, testInfo, "colombia-guide");
  expect(measurements, "Main content bounds must fit the viewport").toEqual([]);
  await noHorizontalOverflow(page);
});

test("planning contact controls do not overlap the floating contact action", async ({ page }, testInfo) => {
  await page.goto(`/plan?${selectedQuery}`);
  const action = page.getByRole("link", { name: "Plan my trip on WhatsApp", exact: true });
  await contactState(page);
  await action.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const action = document.querySelector("[aria-labelledby=plan-contact-title] .btn-primary")!.getBoundingClientRect();
    const floating = document.querySelector(".whatsapp-float")!.getBoundingClientRect();
    window.scrollBy({ top: action.y + action.height / 2 - floating.y - floating.height / 2, behavior: "instant" });
  });
  await screenshot(page, testInfo, "plan-contact-controls");
  const actionBounds = (await action.boundingBox())!;
  const floating = (await page.locator(".whatsapp-float").boundingBox())!;
  const overlapWidth = Math.max(0, Math.min(actionBounds.x + actionBounds.width, floating.x + floating.width) - Math.max(actionBounds.x, floating.x));
  const overlapHeight = Math.max(0, Math.min(actionBounds.y + actionBounds.height, floating.y + floating.height) - Math.max(actionBounds.y, floating.y));
  expect(overlapWidth * overlapHeight, "Primary and floating contact controls overlap").toBe(0);
});

test("general planning remains WhatsApp-first for both destinations without inquiry fields", async ({ page }, testInfo) => {
  for (const query of ["", "?c=egypt", "?c=colombia", `?package=${selected.slug}`]) {
    await page.goto(`/plan${query}`);
    await contactState(page);
    await expect(page.getByText(`Destination: ${query === "?c=egypt" ? "Egypt" : "Colombia"}`, { exact: true })).toBeVisible();
    if (query.includes("package=")) {
      await expect(page.getByRole("main").getByText(selected.name, { exact: true })).toBeVisible();
    } else {
      await expect(page.getByText("Selected journey", { exact: true })).toHaveCount(0);
    }
    if (!query) {
      await screenshot(page, testInfo, "plan-general");
      await page.locator("[aria-labelledby=plan-contact-title]").screenshot({ path: testInfo.outputPath("plan-general-contact.png") });
    }
  }
});

for (const scenario of [
  { name: "unknown package", query: "c=egypt&package=unknown-package", action: "Continue with a general inquiry", target: "c=egypt" },
  { name: "malformed package", query: "c=egypt&package=..%2Fmedellin-guatape", action: "Continue with a general inquiry", target: "c=egypt" },
  { name: "duplicate package", query: `c=egypt&package=${selected.slug}&package=${selected.slug}`, action: "Continue with a general inquiry", target: "c=egypt" },
  { name: "duplicate destination", query: "c=colombia&c=egypt", action: "Continue with Egypt", target: "c=egypt" },
  { name: "invalid destination", query: "c=peru", action: "Continue with Colombia", target: "c=colombia" },
  { name: "mismatched package", query: `c=egypt&package=${selected.slug}`, action: "Choose Colombia for this journey", target: selectedQuery },
  { name: "mismatched package cleared", query: `c=egypt&package=${selected.slug}`, action: "Clear selected journey", target: "c=egypt" },
]) {
  test(`planning correction: ${scenario.name}`, async ({ page }) => {
    await page.goto(`/plan?${scenario.query}`);
    await contactState(page);
    const alert = page.getByRole("main").getByRole("alert");
    await expect(alert).toBeVisible();
    if (scenario.name.startsWith("mismatched")) {
      await expect(page.getByRole("main").getByText(selected.name, { exact: true })).toBeVisible();
      await expect(page.getByText("Destination: Egypt", { exact: true })).toBeVisible();
      await expect(alert).toContainText("different destination");
    }
    if (scenario.name.includes("destination")) {
      await expect(page.getByText("Destination: Please choose a destination", { exact: true })).toBeVisible();
    }
    const action = page.getByRole("link", { name: scenario.action, exact: true });
    await expect(action).toHaveAttribute("href", `/plan?${scenario.target}`);
    await action.click();
    await expect(page).toHaveURL(new RegExp(`/plan\\?${scenario.target}$`));
    await contactState(page);
    await expect(alert).toHaveCount(0);
    await expect(page.getByText("Selected journey", { exact: true })).toHaveCount(scenario.target.includes("package=") ? 1 : 0);
  });
}

test("WhatsApp target navigates under interception without claiming submission or delivery", async ({ page }) => {
  await page.goto(`/plan?${selectedQuery}`);
  await contactState(page);
  const action = page.getByRole("link", { name: "Plan my trip on WhatsApp", exact: true });
  await expect(action).toHaveAttribute("href", whatsappContactUrl);
  await keyboardFocus(action, page);
  await expect(page.getByRole("main")).not.toContainText(/inquiry (?:submitted|delivered)|request (?:submitted|delivered)/i);
  await action.press("Enter");
  await expect(page).toHaveURL(whatsappContactUrl);
  await expect(page.getByText("External navigation intercepted", { exact: true })).toBeVisible();
});

test("shared footer credit is secure, keyboard accessible and opens an intercepted new context", async ({ page, context }) => {
  for (const path of ["/", "/colombia", "/egypt", `/packages/${selected.slug}`, "/plan"]) {
    await page.goto(path);
    const credit = page.getByRole("contentinfo").getByRole("link", { name: "Website by Cleopatra Solutions", exact: false });
    await expect(credit).toHaveAttribute("href", "https://cleopatrasolutions.com/");
    await expect(credit).toHaveAttribute("target", "_blank");
    const rel = (await credit.getAttribute("rel"))!.split(/\s+/);
    expect(rel).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
    await credit.scrollIntoViewIfNeeded();
    await noHorizontalOverflow(page);
  }
  const credit = page.getByRole("contentinfo").getByRole("link", { name: "Website by Cleopatra Solutions", exact: false });
  await keyboardFocus(credit, page);
  const popupEvent = context.waitForEvent("page");
  await credit.press("Enter");
  const popup = await popupEvent;
  await expect(popup).toHaveURL("https://cleopatrasolutions.com/");
  await expect(popup.getByText("External navigation intercepted", { exact: true })).toBeVisible();
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
  await expect(page).toHaveURL(/\/plan$/);
});

test("Egypt absent media stays stable and empty collections are not represented as packages", async ({ page }, testInfo) => {
  expect(egyptPackages).toHaveLength(0);
  const egyptRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (/^\/egypt\/.*\.(jpg|png)$/.test(url.pathname) || (url.searchParams.get("url") || "").startsWith("/egypt/")) {
      egyptRequests.push(url.href);
    }
  });
  await page.goto("/egypt");
  await expect(page.getByRole("heading", { level: 1, name: "Egypt", exact: true })).toBeVisible();
  await expect(page.locator("main .media-fallback")).toHaveCount(5);
  await expect(page.locator("main .country-package-card")).toHaveCount(0);
  await expect(page.getByText("No published journeys are available right now.", { exact: true })).toBeVisible();
  for (const name of ["Cairo & Giza", "Luxor & Aswan", "A Nile cruise", "The Red Sea"]) {
    const heading = page.getByRole("heading", { name, exact: true });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    await expect(page.getByRole("img", { name: `${name}: image unavailable`, exact: true })).toBeVisible();
  }
  const frames = await page.locator(".egypt-experience-image").evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  }));
  for (const frame of frames) {
    expect(frame.width).toBeGreaterThan(0);
    expect(frame.width / frame.height).toBeCloseTo(1.5, 1);
  }
  expect(egyptRequests).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await screenshot(page, testInfo, "egypt-hero-fallback");
  await page.getByRole("heading", { name: "Where the trip can take shape", exact: true }).scrollIntoViewIfNeeded();
  await screenshot(page, testInfo, "egypt-experience-fallbacks");
  await noHorizontalOverflow(page);
});

test("shared country hero handles a real browser image error without collapsing", async ({ page }, testInfo) => {
  await page.goto("/colombia");
  const frame = page.locator(".country-hero");
  const before = await frame.boundingBox();
  await expect(frame.getByRole("img", { name: "Cartagena, Colombia", exact: true })).toBeVisible();
  let failedRequests = 0;
  await page.route((url) => url.pathname === "/_next/image" && url.searchParams.get("url") === "/hero/01-cartagena.jpg", async (route) => {
    failedRequests++;
    await route.fulfill({ status: 404, body: "Deliberate local image failure" });
  });
  await page.reload();
  await expect(frame.getByRole("img", { name: "Cartagena, Colombia: image unavailable", exact: true })).toBeVisible();
  await expect(frame.locator("img")).toHaveCount(0);
  expect(failedRequests).toBeGreaterThan(0);
  expect((await frame.boundingBox())!.height).toBeCloseTo(before!.height, 1);
  await expect(frame.getByRole("heading", { name: "Colombia", exact: true })).toBeVisible();
  await expect(frame.getByText("Private routes planned from Colombia, with the pace and practical detail handled properly.", { exact: true })).toBeVisible();
  await noHorizontalOverflow(page);
  await screenshot(page, testInfo, "colombia-failed-media");
});

test("homepage section transitions keep approved theme and spacing without overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: hero.h1, exact: true })).toBeVisible();
  const sections = page.locator(".country-journeys-section");
  await expect(sections).toHaveCount(2);
  const styles = await sections.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return { padding: parseFloat(style.paddingTop), background: style.backgroundColor };
  }));
  const width = testInfo.project.use.viewport!.width;
  expect(styles.map((style) => style.padding)).toEqual(width <= 680 ? [24, 24] : width <= 1000 ? [32, 32] : [48, 48]);
  expect(styles.map((style) => style.background)).toEqual(["rgb(255, 255, 255)", "rgb(246, 240, 250)"]);
  await sections.nth(1).scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const egypt = document.querySelectorAll(".country-journeys-section")[1];
    window.scrollTo({ top: egypt.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2, behavior: "instant" });
  });
  await noHorizontalOverflow(page);
  await screenshot(page, testInfo, "homepage-destination-transition");
});

test("real homepage slideshow reaches all four absent Egypt images with intact copy", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Next Colombia journeys", exact: true })).toBeEnabled();
  await page.clock.runFor(24_000);
  for (const slide of heroSlides.filter((slide) => slide.country === "Egypt")) {
    await expect(page.locator(".hero-city-indicator")).toHaveText(`${slide.place}, Egypt`);
    await expect(page.locator(".home-hero .hero-slide-active .media-fallback")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: hero.h1, exact: true })).toBeVisible();
    await expect(page.locator(".home-hero").getByText(hero.sub, { exact: true })).toBeVisible();
    await screenshot(page, testInfo, `homepage-${slide.place.toLowerCase()}-fallback`);
    await page.clock.runFor(4000);
  }
  await noHorizontalOverflow(page);
});
