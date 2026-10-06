# SEO Foundation Handoff

Date: 2026-10-05 (America/Bogota).

## Scope and Starting Evidence

Repository: `alitravelframes-front-end`, branch `main`, remote
`https://github.com/Mokhtar-Ali/ali-travel-frames.git`.
The working tree and index were clean before this batch. The preceding browser
batch is commit `4196540364e2623bff07c68d67ce03ca366b531a`,
`test: add browser smoke coverage for travel planning`.
Its existing documentation and saved JSON report recorded 76 passing tests,
zero failures, skips or flaky results. This batch reran all those journey tests.

Installed versions: Next.js 16.3.4, React 19.2.8, Playwright 1.63.0.
The installed Next.js metadata, sitemap, robots and headers guides were read.
No packages were installed or upgraded. No visible copy, design, package
records, carousel, lead API, form validation or contact behavior was changed.

The original SEO-foundation batch implemented independent metadata, canonical,
social-asset and sitemap corrections with rendered-output coverage. It was
committed as `44d23db7917fb04acfaaf24139ede4085fedd578`. The deployment-aware
follow-up below starts from that clean commit and preserves those corrections.
Hosting identity is now verified; hosted preview effectiveness and the business
domain's connection to this project remain unverified.

## Canonical Origin

The existing business SEO configuration in `lib/seo.ts`, `SITE_URL`, establishes
`https://alitravelframes.com` (non-www). The previous layout schema used the same
origin. Canonicals, Open Graph URLs, sitemap URLs, robots sitemap reference and
TravelAgency URL now use that shared configuration. No request host, forwarded
header, localhost address or preview URL determines the canonical origin.

The follow-up verified the repository's Vercel production deployment, but found
that the configured business domain serves different output and is not assigned
to that Vercel project. The configured canonical origin is intentionally
unchanged; this does not certify that the business domain serves this repository.
Search Console ownership and indexing remain unverified.

## Metadata Coverage

Every current public page has its own title, description, canonical and social
metadata through the existing helper:

- `/`: existing private Colombia/Egypt title; description reflects the visible
  VIP planning, concierge support and local expertise.
- `/colombia`, `/egypt`: existing destination-specific metadata retained.
- `/packages`: describes published Colombia journeys and tailor-made Egypt
  planning, without advertising nonexistent published Egypt packages.
- `/about`, `/reviews`: descriptive page-specific titles with company identity;
  existing descriptions retained.
- `/plan`: planning title and contact description reflect the WhatsApp-first
  state, without promising functioning online inquiry submissions.
- All 10 `/packages/[slug]` pages: the existing `generateMetadata` continues
  deriving title, description, image and canonical slug from the same public
  registry that renders package content. No package source copy was rewritten.

The root layout now supplies only site-wide defaults, not a homepage canonical
or homepage Open Graph URL that a child route could inherit. The helper strips
queries and fragments from canonical paths. Selection and tracking variants of
`/plan` resolve to its single production canonical.

Existing local social images are retained only when the asset exists. Missing
images yield text-only social metadata without making a package unpublishable
or noindex. Egypt has no social-image reference while its original assets are
absent. Incorrect generic image dimensions (1600 x 1000) were removed: inspected
existing assets were 2048 x 1152, and the helper cannot assume every image's size.

TravelAgency keeps its existing name, phone and Colombia/Egypt service area;
its URL uses `SITE_URL`, and its description uses the existing shared description
constant with the updated approved-content-based wording. No ratings, review
counts, addresses, prices, new schema types or service claims were added.

## Sitemap Inventory

The existing `app/sitemap.ts` generates **17 URLs**: seven public pages plus
**10 Colombia packages and zero Egypt packages**. No package is filtered by
image availability. `/egypt` remains eligible independently of package count.

Non-package pages: `/`, `/colombia`, `/egypt`, `/packages`, `/reviews`, `/about`,
`/plan`.

Package URLs come exclusively from `content/packages/index.ts`:

```text
/packages/medellin-guatape
/packages/coffee-region
/packages/cartagena-rosario
/packages/santa-marta-minca-tayrona
/packages/medellin-coffee-region
/packages/cartagena-coffee-region
/packages/medellin-cartagena
/packages/san-andres-providencia
/packages/caribbean-coast
/packages/colombia-highlights
```

All entries use absolute configured production URLs. The homepage entry matches
Next.js's rendered canonical `https://alitravelframes.com` without a trailing
slash. Query variants, unknown packages, the internal not-found route and API
routes are absent. There are no draft records, published Egypt records or
configured redirects to add. Unknown packages still invoke `notFound()` and
produce an actual 404 with noindex for an HTML-limited bot.

No trustworthy per-page content-update timestamps exist in the current source.
`lastModified` is therefore omitted, not replaced with commit or build time.
Unchanged `app/robots.ts` allows crawling and references
`https://alitravelframes.com/sitemap.xml`.

## Verified Hosting and Deployment Evidence

Read-only connected Vercel account/project/deployment/domain records identify:

- Provider: Vercel; team `cleopatra-solutions` (Cleopatra Solutions).
- Project: `ali-travel-frames`, ID `prj_cEsUdcCxW1JNWmoLJ9ntEvXVerdz`.
- Git link: GitHub `Mokhtar-Ali/ali-travel-frames`, not another Cleopatra repository.
- Production alias: `https://ali-travel-frames.vercel.app`, verified project domain
  with no branch/custom-environment assignment or domain redirect.
- Deployment: `dpl_5jP2gYt117sgN4JA4WRZjdLtZUHv`, production target, `READY`,
  source `git`, GitHub branch `main`, exact commit
  `44d23db7917fb04acfaaf24139ede4085fedd578` and its SEO commit message.
- Deployment URL:
  `https://ali-travel-frames-nzhv1xk4s-cleopatra-solutions.vercel.app`;
  this URL was identified from metadata, not additionally requested.

[Deployment inspector](https://vercel.com/cleopatra-solutions/ali-travel-frames/5jP2gYt117sgN4JA4WRZjdLtZUHv).
The deployment metadata establishes the revision; matching titles alone do not.
The Git-sourced production record verifies deployment of `main` through the
hosting Git integration despite no repository-visible CI workflow. Inference:
`main` pushes are connected to production deployment and may deploy automatically;
the current production-branch/auto-deploy settings were not independently exposed
by the available project response, and future build success is not guaranteed.
This follow-up did not trigger any deployment or push.

The preview-deployment query returned zero records. The custom-environment
query returned 404, "Environments not found." No actual preview or staging URL
was established or probed. Project metadata reports SSO protection enabled with
deployment type `all_except_custom_domains`; its effective enforcement on a
preview was not tested. No protection was changed or bypassed. The production
alias checks below were unauthenticated requests without bypass headers.

Project environment-variable metadata access was denied (403, permission to list
project environment variables). The "Automatically expose System Environment
Variables" setting was not returned by available project records and remains
unverified. No secrets or environment-file contents were read or printed.
The existing CLI lacked credentials; its unexpected login prompt was cancelled
without completing login. Only existing connected read-only access was used.

## Hosted Output Checked

Low-volume manual-redirect GETs checked the verified production alias on
2026-10-05. Returned HTML/XML was parsed with installed Chromium's `DOMParser`,
without running hosted application scripts. No forms or contact links were used.
All eight endpoints returned **200**, with no redirect location and no
`X-Robots-Tag`. All six HTML pages had exactly one canonical and no general,
Googlebot or Bingbot robots meta directives.

| Path on `https://ali-travel-frames.vercel.app` | Canonical or body evidence |
| --- | --- |
| `/` | `https://alitravelframes.com` |
| `/egypt` | `https://alitravelframes.com/egypt` |
| `/colombia` | `https://alitravelframes.com/colombia` |
| `/packages` | `https://alitravelframes.com/packages` |
| `/packages/medellin-guatape` | `https://alitravelframes.com/packages/medellin-guatape` |
| `/plan` | `https://alitravelframes.com/plan`; unavailable-service notice and "Plan my trip on WhatsApp" link to existing `https://wa.me/19177809875`; zero inquiry fields |
| `/robots.txt` | `User-Agent: *`, `Allow: /`, configured production sitemap reference |
| `/sitemap.xml` | Valid XML; 17 URLs on configured business origin; zero `lastmod` entries |

The alias reflects the completed WhatsApp-first and SEO-foundation behavior.
These hosted observations concern the existing deployed baseline, **not the
uncommitted indexing follow-up**.

Two additional GETs exposed a significant domain mismatch:

- `https://alitravelframes.com/`: 200, no redirect or X-Robots-Tag, no general
  robots meta, canonical `https://alitravelframes.com/`. Title
  "VIP Colombia Travel & Custom Itineraries | Ali Travel Frames" and heading
  "Luxury Travel in Colombia - Designed Around You" (dash normalized here)
  differ from this repository's output.
- `https://alitravelframes.com/plan`: 301 to
  `https://alitravelframes.com/home`; redirect was not followed.

That domain is absent from this project's domain assignments. Its hosting
project and deployed revision remain unverified. Do not infer its commit from
DNS or response-header clues or change local content to resemble it. The owner
must confirm whether this Vercel project is intended to replace that public
website and establish the intended domain mapping separately. No canonical,
domain, DNS or production configuration was changed here.

## Implemented Indexing Policy

`lib/indexing-policy.ts` is used only by server-side `next.config.ts`. It supports
the verified Vercel host, not speculative providers or custom staging mappings.
For nonproduction environments, the supported Next.js `headers()` mechanism
adds one universal **`X-Robots-Tag: noindex`**. Public route metadata is unchanged;
child metadata cannot remove an HTTP response directive. Robots remains
crawlable so crawlers can see noindex. No global dynamic rendering was added.

| Available server environment | New global directive |
| --- | --- |
| `VERCEL=1`, `VERCEL_ENV=production` | None; existing public/excluded route policies remain |
| `VERCEL=1`, `VERCEL_ENV=preview` or `development` | `X-Robots-Tag: noindex` |
| No hosting identity, `NODE_ENV=development` | `X-Robots-Tag: noindex` for actual local development |
| No hosting identity, optional `ATF_LOCAL_INDEXING_TEST=1` | `X-Robots-Tag: noindex` for explicit local production-build testing |
| Missing, malformed or unknown deployment identity | None; preserve existing public baseline rather than guessing a production block |

`NODE_ENV=production` alone never identifies the live deployment. The local-test
switch is optional, is not a required hosting flag, and is ignored when Vercel
identity is present (including unknown Vercel environment values). It must not
be configured on hosted environments. No credentials or request/forwarded-host
headers participate in deployment identity or canonical construction.
Unknown or incomplete host markers are not interpreted as local development.

[Vercel system-variable documentation](https://vercel.com/docs/environment-variables/system-environment-variables)
defines `VERCEL` and `VERCEL_ENV` at build/runtime and documents the system-env
exposure setting. Its actual setting is an **owner verification prerequisite for
hosted preview enforcement**. Missing signals deliberately preserve production
indexability but cannot guarantee preview noindex. Do not describe local
simulation as a verified hosted preview. Existing preview protection must stay
enabled; never disable it merely to inspect tags.

The header rules are **built into the build artifact**. Build previews with
preview identity and production with production identity. Changing environment
values only at `next start` does not regenerate them. A controlled negative test
confirmed that a preview artifact still sends noindex under production runtime
values. **Do not promote a preview-built artifact directly to production**;
produce and verify a fresh production-target build instead. Local production
testing with the optional switch likewise requires a fresh local build, e.g.
`ATF_LOCAL_INDEXING_TEST=1 npm run build`, then
`ATF_LOCAL_INDEXING_TEST=1 npm run start`. Do not reuse that artifact for release.

## Original SEO-Foundation Verification

The following checks were recorded for the original foundation batch before
the deployment-aware follow-up. Current follow-up results are listed below:

| Command | Result |
| --- | --- |
| `npm test` | 32 passed, zero failed: 25 existing plus seven SEO tests |
| `npm run lint` | Exit 0, no autofix |
| `npx --no-install tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0; Next.js webpack production-mode build; all 10 package pages prerendered |
| `E2E_PORT=3211 npm run test:e2e` | 100 passed, zero failures/skips/flaky results, no retries; 36.8 seconds |
| `git diff --check` | Exit 0 |

Browser coverage: headless Chromium 153.0.8010.12; desktop 1440 x 900,
mobile 390 x 844, tablet 768 x 1024, short desktop 1440 x 600. The installed
in-app browser execution tool was unavailable; the existing standalone
Playwright setup ran successfully after approval to bind the local test server.
The first sandbox attempt failed with localhost EPERM, not a test pass.
An initial browser run had eight assertion failures because the test expected a
homepage canonical trailing slash. The assertions and sitemap entry were
corrected to match actual Next.js output, rebuilt, and the full suite rerun.

`tests/e2e/seo.spec.ts` parses actual HTML via browser `DOMParser`, checks all
17 distinct titles and canonical tags, verifies every package's registry-derived
metadata, fetches every referenced social asset locally, parses actual sitemap
XML, inspects robots text and response headers, verifies an actual not-found
response, and checks server-rendered package content, internal links and schema.
HTML-limited-bot requests check metadata in the head; hydrated browser visits
check representative routes and query variants without changing Next.js's
streaming metadata behavior. The checks verify the unchanged public-indexing
baseline only, not deployment-dependent preview policy.

All 76 original browser journey tests passed again. Desktop selected-package
contact and mobile contact-control screenshots were visually inspected. The
saved final browser report records 100 coverage entries, no page errors and no
inquiry POSTs. External browser traffic and contact navigation remain
intercepted; no messages, emails or lead submissions were sent. Existing
controlled backend tests are not live delivery verification.

Generated screenshots, traces, HTML reports and `test-results/results.json`
remain ignored artifacts, not application changes or handoff source files.

A fresh local preview was started with
`npm run start -- --hostname 127.0.0.1 --port 3212` at
`http://127.0.0.1:3212`. A separate installed-Chromium check of the selected
Medellin/Guatape planning route at desktop and mobile sizes returned HTTP 200,
the new page-specific title, canonical `https://alitravelframes.com/plan`,
visible selection/contact notice, the unchanged configured WhatsApp link, zero
inquiry fields and no page errors. External traffic was blocked and the contact
link was read without sending a message. This local preview is intentionally
available for inspection; it is not a production deployment.

## Original Foundation Changed Files

```text
app/about/page.tsx
app/layout.tsx
app/packages/page.tsx
app/page.tsx
app/plan/page.tsx
app/reviews/page.tsx
app/sitemap.ts
lib/seo.ts
tests/e2e/seo.spec.ts
tests/seo.test.mjs
docs/seo-readiness.md
```

## Deployment-Aware Verification

The focused policy tests cover production precedence, preview/development,
explicit local testing and missing/malformed signals, plus the actual config
header rule with controlled dependencies. `npm run test:indexing` launches
installed Chromium and five isolated fresh webpack builds in temporary
snapshots that omit `.env` files, credentials and previous `.next` output. A
sixth test launches a fresh actual development server. Each test owns and stops
its server and removes its snapshot; no unrelated server is terminated.

Actual returned HTML/headers are checked for seven representative routes and
query variants, including static pages, the real Medellin/Guatape package and
`/plan`. Checks include general/bot-specific meta, universal header, stable
production canonicals even with an untrusted forwarded host, crawlable robots,
17 production-origin sitemap URLs and the existing 404/noindex exclusion.
An intentional preview-artifact/production-runtime reuse test is a negative
promotion check, not mistaken stale-build evidence. These are **controlled local
environment simulations**, not live preview or search-engine verification.

| Follow-up command | Actual result |
| --- | --- |
| `npm test` | 37 passed, zero failures (32 existing plus five indexing-policy tests) |
| `npm run test:indexing` | Six passed, zero failures/skips; 42.9 seconds; seven verified server runs including the promotion-negative check |
| `npm run lint` | Exit 0, no autofix |
| `npx --no-install tsc --noEmit` | Exit 0 |
| `VERCEL=1 VERCEL_ENV=production npm run build` | Exit 0, controlled local production identity; all 10 package pages prerendered |
| `E2E_PORT=3211 npm run test:e2e` | 100 passed, zero failures/skips/flaky results, no retries; 36.0 seconds |
| `git diff --check` | Exit 0 |

The browser rerun covered all original journey and SEO tests at desktop
1440 x 900, mobile 390 x 844, tablet 768 x 1024 and short desktop 1440 x 600.
Fresh desktop selected-package and mobile general-contact screenshots were
visually inspected: approved purple/white presentation, selection and
WhatsApp-first notice/action remain intact. External navigation was intercepted;
no live messages or inquiries were sent. The existing missing `/brand/ali.jpg`
warning remains outside this indexing batch. The in-app browser execution tool
was unavailable; existing standalone Playwright/Chromium provided these checks.

Follow-up changed files only:

```text
lib/indexing-policy.ts
next.config.ts
package.json
tests/indexing-policy.test.mjs
tests/indexing-rendered.mjs
docs/seo-readiness.md
```

`package.json` adds one test command; dependencies and lockfile are unchanged.
Build/test output stays ignored. No metadata, approved copy, theme, package
registry, destination sections, form/API validation or contact flow was edited.

## Remaining Limitations

- The Vercel baseline deployment/revision is verified, but this uncommitted
  follow-up has not been deployed. No real preview/staging URL or preview-header
  enforcement was verified; system-env exposure requires owner confirmation.
- Business-domain mapping is unresolved; the actual business site differs from
  the verified repository deployment. No configuration change is authorized.
- Actual Google indexing and Search Console ownership remain unverified.
- Browser tests still observe the pre-existing missing `/brand/ali.jpg` portrait
  on `/about`; it is not a social asset and was not replaced in this batch.
- Approved actual Egypt package records remain required; original images are
  optional visual enhancements because image-free cards and media fallbacks
  remain supported. No Egypt packages or URLs were invented.
- Lead delivery remains unavailable; WhatsApp-first behavior and validation
  are preserved. Calendly and external contact delivery were not verified.
- Cross-browser engines, physical devices and manual 200% zoom remain unverified.

No commit, push or deployment was performed for this implementation batch.
