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

Implemented: independent metadata, canonical, social-asset and sitemap
corrections with rendered-output coverage. Environment-aware indexing is
**blocked by missing verified deployment identity**, not completed.

## Canonical Origin

The existing business SEO configuration in `lib/seo.ts`, `SITE_URL`, establishes
`https://alitravelframes.com` (non-www). The previous layout schema used the same
origin. Canonicals, Open Graph URLs, sitemap URLs, robots sitemap reference and
TravelAgency URL now use that shared configuration. No request host, forwarded
header, localhost address or preview URL determines the canonical origin.

Live domain redirects, DNS, hosting domain configuration and Search Console
ownership were not independently verified. This preserves the configured origin;
it does not certify a production deployment.

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

## Indexing Blocker and Pre-Push Prerequisite

The repository contains no verified hosting project link, deployment workflow,
environment contract or production/preview identity configuration. README's
generic "Deploy on Vercel" instructions and a stock Vercel SVG do not prove
that Vercel hosts this site. The inspected shell did not supply `VERCEL` or
`VERCEL_ENV`. Hosting-level preview protection is unverified and was untouched.

No environment-aware indexing change was made. No required variable was added,
and `NODE_ENV=production` was not interpreted as production deployment identity.
The actual unchanged baseline is:

| Environment | Current output / status |
| --- | --- |
| Local production-mode build used for tests | Public pages have no noindex metadata/header; robots allows crawling; invalid packages are noindex |
| Real production deployment | Expected to retain the public route policies; actual hosting output unverified |
| Preview/staging | Required noindex enforcement blocked; current code does not distinguish this environment |
| Local development | Environment-specific noindex enforcement also not implemented; not tested in this batch |

**Before pushing this as a complete SEO-foundation batch**, confirm the actual
host, its reliable deployment-provided production/preview identity, and existing
preview protection. Then implement and test the supported environment-aware
policy in a separately reviewed correction. Canonicals must stay on the
configured production origin. Preview/local noindex must survive nested route
metadata, including `/plan`'s explicit indexable policy; response headers can
enforce that without metadata inheritance mistakes. Do not use `Disallow: /`
to conceal the noindex directive from crawlers, or default an unknown live
deployment to noindex because a new variable is absent.

Required hosting configuration is not yet determinable. No production or
hosting configuration was changed, and no protection was bypassed to test.
Production/preview policy comparisons with controlled deployment identities and
nested-route preview noindex checks remain **blocked**, not passing tests.

## Actual Verification

Final checks ran against the application and tests in this working tree:

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

## Changed Files

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

## Remaining Limitations

- Deployment identity and environment-aware noindex remain blocked as above.
- Actual Google indexing, Search Console ownership, live-domain redirects and
  production headers/HTML were not verified by local tests.
- Browser tests still observe the pre-existing missing `/brand/ali.jpg` portrait
  on `/about`; it is not a social asset and was not replaced in this batch.
- Approved actual Egypt package records remain required; original images are
  optional visual enhancements because image-free cards and media fallbacks
  remain supported. No Egypt packages or URLs were invented.
- Lead delivery remains unavailable; WhatsApp-first behavior and validation
  are preserved. Calendly and external contact delivery were not verified.
- Cross-browser engines, physical devices and manual 200% zoom remain unverified.

No commit, push or deployment was performed for this implementation batch.
