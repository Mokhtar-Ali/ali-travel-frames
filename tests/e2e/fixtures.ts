import { test as base, expect, type Locator, type Page, type TestInfo } from "@playwright/test";

export const test = base.extend<{ browserSafety: void }>({
  browserSafety: [async ({ context, page, baseURL, browser }, use, testInfo) => {
    const origin = new URL(baseURL!).origin;
    const externalRequests: string[] = [];
    const pageErrors: string[] = [];
    const leadPosts: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === origin) {
        if (url.pathname === "/api/lead" && request.method() === "POST") {
          leadPosts.push(url.href);
          await route.abort();
        } else {
          await route.continue();
        }
      } else {
        externalRequests.push(url.href);
        if (request.isNavigationRequest()) {
          await route.fulfill({
            contentType: "text/html",
            body: "<!doctype html><title>Intercepted</title><p>External navigation intercepted</p>",
          });
        } else {
          await route.abort();
        }
      }
    });
    await use();
    await testInfo.attach("browser-coverage", {
      contentType: "application/json",
      body: Buffer.from(JSON.stringify({
        engine: "Chromium", version: browser.version(), viewport: page.viewportSize(),
        externalRequests, pageErrors, leadPosts,
      }, null, 2)),
    });
    expect(leadPosts, "The smoke suite must not submit inquiries").toEqual([]);
    expect(pageErrors, "Unexpected application JavaScript errors").toEqual([]);
  }, { auto: true }],
});

export { expect };

export async function noHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
    document.documentElement.clientWidth,
  ), { message: "Document-level horizontal overflow" }).toBeLessThanOrEqual(1);
}

export async function keyboardFocus(locator: Locator, page: Page) {
  await locator.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(locator).toBeFocused();
  const outline = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { visible: element.matches(":focus-visible"), width: parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(outline.visible).toBe(true);
  expect(outline.width).toBeGreaterThanOrEqual(2);
  expect(outline.style).not.toBe("none");
  await expect.poll(() => locator.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const target = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return target !== null && element.contains(target);
  }), { message: "Focused control must be onscreen and unobscured" }).toBe(true);
}

export async function screenshot(page: Page, testInfo: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).filter((image) => {
    const bounds = image.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
  }).every((image) => image.complete));
  await page.screenshot({ path: testInfo.outputPath(`${name}.png`), animations: "disabled" });
}

export async function contactState(page: Page) {
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: "Plan your journey with us", exact: true })).toBeVisible();
  await expect(main.getByText("Contact Ali Travel Frames on WhatsApp to discuss your trip while online inquiry submissions are unavailable.", { exact: true })).toBeVisible();
  await expect(main.getByRole("link", { name: "Plan my trip on WhatsApp", exact: true })).toBeVisible();
  await expect(main.locator("form, input, textarea, select, button[type=submit]")).toHaveCount(0);
  const notice = await main.locator("[aria-labelledby=plan-contact-title]").boundingBox();
  const booking = await main.locator(".calendly-inline-widget").boundingBox();
  expect(notice).not.toBeNull();
  expect(booking).not.toBeNull();
  expect(notice!.y + notice!.height).toBeLessThanOrEqual(booking!.y);
  await noHorizontalOverflow(page);
}
