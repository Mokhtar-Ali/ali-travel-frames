# Ali Travel Frames Correction Handoff

Verified repository: `alitravelframes-front-end`, remote
`https://github.com/Mokhtar-Ali/ali-travel-frames.git`, branch `main`, starting
commit `cb5e67f61230b23fed96a4272f29361068e0b8f8`. The starting worktree was clean.

## Implemented

- `/api/lead` validates requests and returns HTTP 503 with
  `{ "ok": false, "code": "LEAD_SERVICE_UNAVAILABLE" }` for otherwise valid
  submissions. There is no approved, implemented persistence or delivery
  integration in this repository. Adding credentials alone will not enable one.
- `/plan` now checks availability on the server before rendering the inquiry
  entry path. With the service unavailable, it shows `Plan your journey with us`,
  the requested availability notice, and the primary `Plan my trip on WhatsApp`
  action before the existing booking widget. No online inquiry form or entry
  fields are rendered. Valid destinations and package names remain visible;
  invalid, duplicate and mismatched selections retain correction messages and
  explicit reset or destination-correction links.
- `lib/lead-service.ts` is marked server-only and reports unavailable because no
  adapter is implemented. It reads no environment variables or credentials.
  Future availability must reflect an actual implemented adapter and its
  required configuration. Controlled test dependencies exercise the available
  rendering branch without enabling a service or changing production settings.
- Invalid input returns HTTP 400. Names, emails, destinations, whole-number
  traveller counts and package selections are validated. JSON primitives,
  arrays and malformed JSON are rejected.
- The preserved inquiry form, when a working backend is enabled, displays a
  validated package name and retains its slug.
  Unknown or malformed selections and duplicate query parameters require an
  explicit reset. Destination mismatches block submission until corrected or
  the package is explicitly cleared. Changing destination resets destination
  interest checkboxes, while other entered details remain in their fields.
- In that form branch, the form stays mounted after failure, with its entered
  fields intact. Loading
  disables editing and repeated submission. Errors use `role="alert"`; loading
  and confirmation use status announcements. Confirmation receives focus.
- Success requires a successful HTTP response plus an application result with
  `ok: true` and `status: "accepted"` or `"saved"`. A bare `{ ok: true }` is
  rejected. Notification failure after accepted/saved results is distinguished
  and does not encourage duplicate submission. The actual API currently emits
  neither successful outcome.
- The existing WhatsApp number is offered as a contact alternative. Clicking
  that link has no confirmation handler and does not imply a sent message.
- The homepage guide uses the same response checks and no longer describes
  unavailable submissions as an invalid email or promises unverified delivery.
- Missing Egypt page images use accessible purple-and-white fallbacks inside
  their existing hero and 3:2 experience frames. An image-load error replaces
  only the media, keeping the surrounding content. Known missing sources are
  not passed into Next Image. Missing Egypt hero slideshow assets are also
  guarded, including idle prefetch; the original slide order, place labels,
  company copy and transition logic remain. Homepage fallback backgrounds omit
  a visible fallback label so it cannot overlap the hero copy.
- Egypt metadata no longer advertises its known missing image. Other metadata
  retains the existing defaults.
- The targeted trust statement is now exactly
  `Personal planning. Clear trip details.`

The Colombia package carousel, package records, reviews, replacement photograph,
Cleopatra Solutions footer link, theme variables, and section spacing rules
were not edited. Shared hero media handling changed as described above; visual
equivalence remains unverified in a browser.

## Selected-Package Data Path

1. Existing detail links retain `/plan?c=colombia&package=medellin-guatape`.
2. `app/plan/page.tsx` awaits the installed Next.js version's `searchParams`
   promise, reading both values without discarding duplicate parameters.
3. `resolveInquirySelection` resolves the slug through `getPackage` in
   `content/packages/index.ts`. It derives canonical name and destination from
   the public record. A package-only link derives its destination from that record.
4. While unavailable, the contact notice displays the resolved destination and
   package name without collecting inquiry fields or submitting any data. The
   WhatsApp action reuses `https://wa.me/19177809875`; opening it has no success
   handler. In the available form branch, `PlanLeadForm` displays the registry's
   actual accented package name and sends only the selected slug alongside the
   inquiry fields. It sends no package name or package price.
5. `/api/lead` calls `validateLead`, which resolves the selection again and builds
   canonical `lead.package = { slug, name, country }` and `lead.country`.
   Browser-supplied package names and prices are ignored; conflicts are rejected.
6. No adapter is invoked because none is implemented. The API reports service
   unavailability, and the normalized data is neither persisted nor delivered.

## Egypt Source Recovery: Blocked

Current public counts: **10 Colombia packages, 0 Egypt packages**. The empty
collection in `content/packages/egypt/index.ts` was not populated. Matching empty
homepage and Egypt collections does not satisfy package-carousel restoration.

Read-only discovery covered:

- Current `content/packages/**`, public registries, `content/types.ts`,
  `app/egypt/page.tsx`, homepage and package routes, and `public/**`, including
  filenames and case variants.
- Repository file listings for JSON, MDX, Markdown and content/configuration
  exports; `README.md`, `CLAUDE.md`, `AGENTS.md`, `lib/**`, `app/api/**`,
  `package.json` and `next.config.ts`. No implemented or documented CMS source
  for Egypt package records was found. Airtable/Resend were TODOs only.
- `git branch -a`, all eight commits reachable through `git log --all`,
  `git reflog --all`, historical content exports including
  `7bb2b74:content/packages.ts`, and Git searches for Egypt and CMS/provider terms.
- `git fsck --no-reflogs --unreachable --no-progress`: 62 unreachable trees and
  75 unreachable blobs inspected for Egypt-related content. The price/duration
  term matches were review/marketing content or the shared detail template,
  not Egypt package records. No history was restored or rewritten.

Historical evidence: `2cd831d:app/egypt/page.tsx` has four experience cards
(`Cairo & Giza`, `Luxor & Aswan`, `A Nile cruise`, `The Red Sea`) and an inquiry
action. Those are destination descriptions, without package slugs, durations,
prices or itineraries. The Egypt page did not exist in earlier `859bd06`.
`cb5e67f` introduced the empty Egypt registry. Unreachable blob
`24076d0ad1ca62fe9394dd74395540e0536e8a12` contains the same empty registry.

Required from the owner: the actual approved Egypt package modules, content
export, or documented source location, with current publishable records and
approved supplied details. No historical prices or sample packages were published.

**Required for Egypt packages:** approved actual package records. The destination
experience descriptions are not package records and cannot replace that source.

**Optional visual enhancement:** the missing original image assets. Photography
is not a required content source and must not block otherwise valid package
records. The existing stable media fallbacks remain usable while original
photography is unavailable. Egypt's count stays at zero until approved records
exist, independently of whether those images are supplied.

Optional original media, now protected by fallbacks:

- `/egypt/hero-1.jpg`, `/egypt/hero-2.jpg`, `/egypt/hero-3.jpg`, `/egypt/hero-4.jpg`
- `/egypt/cairo.jpg`, `/egypt/luxor.jpg`, `/egypt/nile.jpg`, `/egypt/red-sea.jpg`

No approved matching alternative asset was found. No image URLs or photography
were invented.

## Verification

| Check | Result |
| --- | --- |
| `npm test` | 25 passed, 0 failed; Node runner with installed TypeScript compiler |
| `npm run lint` | Passed without autofix |
| `npx --no-install tsc --noEmit` | Passed |
| `npm run build` | Passed; 10 package detail routes prerendered |
| `git diff --check` | Passed |
| Follow-up local HTTP checks via Node `fetch` and assertions | 10 `/plan` query variants returned 200; each showed the notice/contact action before booking, preserved selection/error context, and no inquiry fields |
| Original batch synthetic POST: valid Colombia package | HTTP 503, `LEAD_SERVICE_UNAVAILABLE` |
| Original batch synthetic POST: destination mismatch | HTTP 400, `PACKAGE_DESTINATION_MISMATCH` |
| Original batch synthetic POST: unknown package | HTTP 400, `UNKNOWN_PACKAGE` |

The original batch's local HTML checks confirmed 10 homepage package links,
10 Colombia destination links,
0 Egypt package links, five Egypt page fallbacks, retained experience copy,
the selected Colombia name/slug, the changed trust statement, and the footer
credit. This follow-up confirmed the exact contact notice and
`https://wa.me/19177809875` link destination from rendered HTML only, without
opening WhatsApp or sending a message. The `/plan` cases were: no parameters,
Egypt, valid Colombia package, package-only, mismatch, unknown package,
malformed slug, duplicate destinations, duplicate packages, and invalid country.

Tests cover real validation/response functions, the route handler, server-rendered
markup and component handlers with controlled hooks/FormData/fetch. Acceptance
and notification-failure cases are mocked responses to the frontend. They do not
prove a real backend integration, persistence, email delivery, browser DOM field
retention, focus behavior, image-request behavior, or carousel motion.

The added tests cover the unavailable view with zero entry fields, the exact
notice and primary WhatsApp action, visible package/destination context,
invalid/duplicate/mismatched correction links, controlled available-backend
rendering, and runtime failure with the original fields and reusable entered
values retained. The form component, API validation and API 503 behavior were
preserved without edits in this follow-up.

Browser tooling was unavailable: no callable in-app browser execution tool,
agent-browser CLI, Playwright, Puppeteer, DOM test environment or React test
renderer. No dependencies were installed. Desktop/mobile visual and interaction
checks remain **unverified**. Real persistence and downstream delivery remain
**unavailable/unverified**. No live inquiries, emails or messages were sent.

## Manual Browser Checklist

Local preview: `http://127.0.0.1:3010`. Start with
`npm run dev -- --hostname 127.0.0.1 --port 3010` if it is no longer running.

1. At desktop `1440 x 900` and mobile `390 x 844` (also check width `320`), open
   `/plan`. Confirm the exact requested heading, notice and primary WhatsApp
   action appear before the booking widget. Confirm there are no name, email,
   trip-detail fields or `Send it` inquiry button. Check text wrapping and
   keyboard focus on the contact action.
2. Inspect that action's link in browser DevTools or copy its link address.
   Confirm it is exactly `https://wa.me/19177809875`. Do not navigate to WhatsApp
   or send a message. The page must not show a sent/received/delivered confirmation.
3. Open `/plan?c=colombia&package=medellin-guatape`. Confirm the actual accented
   package name and Colombia remain visible above the contact action. Open
   `/plan?c=egypt&package=medellin-guatape`; confirm Egypt, the Colombia package,
   and a mismatch warning are visible. Follow `Choose Colombia for this journey`
   to correct the link, then revisit the mismatch and follow `Clear selected
   journey` to confirm a general Egypt contact view without a selected package.
4. Open `/plan?c=egypt&package=unknown-package`,
   `/plan?c=egypt&package=..%2Fmedellin-guatape`,
   `/plan?c=colombia&c=egypt`, and
   `/plan?c=egypt&package=medellin-guatape&package=coffee-region`.
   Confirm visible correction messages, working explicit reset/destination
   links, and no inquiry fields. Duplicate destinations must not be presented
   as one silently selected destination.
5. Inspect `/egypt` for all four experience descriptions, five stable media
   fallbacks, reviews, inquiry action and footer credit. Watch the homepage
   slideshow through Cairo, Giza, Luxor and Aswan; confirm purple fallback
   backgrounds with intact copy and place labels.
6. In local browser DevTools, block the Colombia hero's optimized image request
   containing `url=%2Fhero%2F01-cartagena.jpg`, then reload `/colombia` to exercise
   real image-load failure. Confirm its frame, heading and subtitle stay visible.
   Clear the block afterward.
7. Use keyboard navigation and the Colombia carousel arrows through its final
   package. Check focus visibility, containment and existing desktop/mobile
   spacing. Egypt package reachability checks remain blocked by zero records.

Desktop/mobile visual inspection and these interaction steps remain unverified
because browser tooling is unavailable. The available-backend form branch and
runtime failures are tested with controlled dependencies; manual browser DOM
retention remains unverified while no approved local backend or browser mocking
environment exists. Do not enable a production backend to perform that check.

## Targeted Follow-Up Files

- `app/plan/page.tsx`: server availability gate and contact notice/selection links.
- `lib/lead-service.ts`: server-only availability policy; no adapter or env switch.
- `tests/inquiry.test.mjs`: five additional focused tests and updated page expectation.
- `docs/correction-batch.md`: current entry path, Egypt classification and manual steps.

## Changed Files

- `app/api/lead/route.ts`
- `app/egypt/page.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/plan/page.tsx`
- `app/plan/PlanLeadForm.tsx`
- `components/CountryHero.tsx`
- `components/Guide.tsx`
- `components/Hero.tsx`
- `components/ImageWithFallback.tsx`
- `content/site.ts`
- `lib/inquiry-selection.ts`
- `lib/lead.ts`
- `lib/lead-service.ts`
- `lib/lead-response.ts`
- `lib/seo.ts`
- `package.json` (test script only)
- `tests/helpers.mjs`
- `tests/inquiry.test.mjs`
- `tests/egypt-media.test.mjs`
- `docs/correction-batch.md`

No dependencies, CMS records, production configuration, pushes or deployments
were changed.
