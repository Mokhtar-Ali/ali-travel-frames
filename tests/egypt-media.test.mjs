import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource, componentHarness, findNodes, textContent } from "./helpers.mjs";

test("absent and blank image data render an accessible fallback without an image request", () => {
  for (const src of [undefined, "", "   "]) {
    const { ImageWithFallback } = loadSource("components/ImageWithFallback.tsx");
    const html = renderToStaticMarkup(createElement(ImageWithFallback, {
      src, alt: "Cairo & Giza", width: 1200, height: 800,
    }));
    assert.match(html, /media-fallback/);
    assert.match(html, /aria-label="Cairo &amp; Giza: image unavailable"/);
    assert.doesNotMatch(html, /<img|src=/);
  }
});

test("image-load failure swaps only the media for a fallback and preserves its frame", () => {
  const props = { src: "/egypt/cairo.jpg", alt: "Cairo & Giza", width: 1200, height: 800 };
  const h = componentHarness("components/ImageWithFallback.tsx", "ImageWithFallback", props);
  const before = h.render();
  const image = findNodes(before, (n) => Boolean(n.props?.onError))[0];
  assert.equal(image.props.src, props.src);
  image.props.onError();
  const after = h.render();
  assert.equal(after.props.className, before.props.className);
  assert.equal(findNodes(after, (n) => Boolean(n.props?.onError)).length, 0);
  assert.match(textContent(after), /Image unavailable/);
  assert.equal(findNodes(after, (n) => n.props?.role === "img").length, 1);
  const replaced = h.render({ ...props, src: "/hero/01-cartagena.jpg" });
  assert.equal(findNodes(replaced, (n) => Boolean(n.props?.onError)).length, 1);
});

test("Egypt page keeps all experience content, reviews and inquiry action while images are absent", () => {
  const { default: EgyptPage, metadata } = loadSource("app/egypt/page.tsx");
  const html = renderToStaticMarkup(createElement(EgyptPage));
  assert.equal((html.match(/class="media-fallback"/g) || []).length, 5);
  for (const text of ["Egypt", "Cairo &amp; Giza", "Luxor &amp; Aswan", "A Nile cruise", "The Red Sea",
    "The pyramids, the Egyptian Museum", "Temples, tombs", "A slower way", "Clear water",
    "Egypt journeys", "In their words"]) {
    assert.ok(html.includes(text), `Missing page content: ${text}`);
  }
  assert.match(html, /href="\/plan\?c=egypt"/);
  assert.doesNotMatch(html, /src="[^\"]*egypt|url=%2Fegypt/);
  assert.equal(metadata.openGraph.images, undefined);
  assert.equal(metadata.twitter.images, undefined);
});

test("fallback eligibility verifies files and preserves existing Colombia hero media", () => {
  const { publicAssetExists } = loadSource("lib/public-assets.ts");
  assert.equal(publicAssetExists("/egypt/hero-1.jpg"), false);
  assert.equal(publicAssetExists(undefined), false);
  assert.equal(publicAssetExists("/hero/01-cartagena.jpg"), true);
  const { CountryHero } = loadSource("components/CountryHero.tsx");
  const html = renderToStaticMarkup(createElement(CountryHero, {
    title: "Colombia", subtitle: "Existing copy", image: "/hero/01-cartagena.jpg", imageAlt: "Cartagena",
  }));
  assert.match(html, /<img/);
  assert.doesNotMatch(html, /media-fallback/);
});

test("each homepage Egypt slide preserves its place and copy without requesting missing media", () => {
  const { heroSlides, hero } = loadSource("content/site.ts");
  const { publicAssetExists } = loadSource("lib/public-assets.ts");
  const unavailableImages = heroSlides.filter((s) => !publicAssetExists(s.image)).map((s) => s.image);
  assert.equal(unavailableImages.length, 4);
  for (let index = 6; index < heroSlides.length; index++) {
    let stateCalls = 0;
    // Select a slideshow state for SSR; movement still needs a browser check.
    const { Hero } = loadSource("components/Hero.tsx", {
      react: {
        ...React,
        useState(initial) {
          const state = React.useState(initial);
          return stateCalls++ < 2 ? [index, state[1]] : state;
        },
      },
    });
    const html = renderToStaticMarkup(createElement(Hero, { unavailableImages }));
    assert.match(html, /media-fallback/);
    assert.doesNotMatch(html, /url=%2Fegypt|src="\/egypt/);
    assert.ok(html.includes(`${heroSlides[index].place}, Egypt`));
    assert.ok(html.includes(hero.h1));
    assert.ok(html.includes(hero.sub));
  }
});
