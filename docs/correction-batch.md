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

At the time of the original correction and WhatsApp-first batches, browser
tooling was unavailable: no callable in-app browser execution tool,
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

## Browser Smoke-Test Follow-Up: 2026-10-05

Started from committed `43fd6ad` on `main` with a clean worktree in
`alitravelframes-front-end`. That commit was not amended or recreated. This
follow-up has not been committed, pushed or deployed.

### Setup and Safety

- Existing environment: npm lockfile, Node `v24.14.0`, npm `11.9.0`.
- No browser framework was installed. Added development dependency
  `@playwright/test@1.63.0` (requires Node >=20), with matching `playwright` and
  `playwright-core` transitive packages. Next.js, React and unrelated package
  versions were not changed. Existing scripts and 25 Node tests were preserved.
- With explicit installation/network approvals, ran
  `npm install --save-dev --save-exact @playwright/test@1.63.0` and
  `npx --no-install playwright install chromium`. Chromium artifacts are in the
  user's Playwright cache, not the repository. No examples or application pages
  were generated.
- `playwright.config.ts` runs a locally served production build at
  `http://127.0.0.1:3210`, with one worker and no retries. Set `E2E_PORT` to
  another available port if necessary. The runner refuses to reuse an existing
  server and shuts down only its own server after testing.
- The initial sandboxed run failed with
  `listen EPERM: operation not permitted 127.0.0.1:3210`. The explicitly approved
  retry successfully served the application and launched Chromium. This was an
  environment restriction, not an application defect.
- Browser-context interception prevents external requests, including analytics,
  Calendly and contact destinations. External navigation receives a local test
  document at the requested URL. Every test fails on an attempted inquiry POST
  or an application JavaScript error. No inquiries, messages, emails or bookings
  were sent. Third-party booking functionality is not covered.
- Reports, screenshots and traces are ignored by Git and lint. HTML and JSON
  reports are generated; failure traces are retained without automatic retries.
  Configuration follows the installed Next.js Playwright guide and
  [Playwright webServer documentation](https://playwright.dev/docs/test-webserver).

### Confirmed Defects and Minimal Corrections

| Defect | Reproduction and observed behavior | Correction and verification |
| --- | --- | --- |
| Medium: Colombia region cards overlap and cause tablet horizontal overflow | Open `/colombia` at 768 x 1024. Aspect ratio plus 380px minimum height expanded cards to 285px despite narrower grid columns. The third card extended to x=797.42, producing 29px document overflow. | Added `width: 100%` to `.region-card` in `app/globals.css`. Preserved the grid, minimum height and content. Tests check document bounds and neighboring cards in the same row across all four viewports. |
| Medium: mobile planning contact controls overlap | Open `/plan?c=colombia&package=medellin-guatape` at 390 x 844 and scroll the primary WhatsApp action alongside the floating contact control. Their bounding rectangles intersected by 2,900 square pixels; screenshot confirmed the overlap. | Limited the unavailable-state primary action's mobile width to reserve the existing 76px floating-control gutter. Copy, colors, floating link and desktop styling remain. Regression places both controls at the same vertical position and requires zero overlap. |
| Medium: focused carousel arrow is obscured in a short viewport | At 1440 x 600, reach the homepage carousel with keyboard focus, Tab to the track and Shift+Tab back to the next arrow. Its outline existed, but the control was behind the sticky header. | Added 104px scroll margin to carousel control buttons. Keyboard regression requires focus-visible styling and verifies the focused control is the actual onscreen hit target, including the short viewport. |

Initial test-only failures were also corrected without changing application
behavior: planning alerts are now scoped to `main` to exclude Next.js's route
announcer; reverse carousel navigation is tested before leaving the page rather
than assuming history restores the carousel; each navigation step waits for
scroll controls to reflect the completed browser scroll. Reachability and
overflow assertions were retained, not relaxed.

### Actual Final Results

Engine: headless Chromium **153.0.8010.12**, recorded by the running browser in
76 per-test coverage attachments. Viewports: desktop **1440 x 900**, mobile
**390 x 844** (mobile/touch emulation), tablet **768 x 1024** (touch emulation),
and short desktop **1440 x 600**. This is not physical-device or cross-browser
coverage.

| Command | Final result |
| --- | --- |
| `npm test` | 25 passed, 0 failed; existing controlled tests remain distinct from delivery verification |
| `npm run lint` | Passed without autofix, including browser tests and excluding generated artifacts |
| `npx --no-install tsc --noEmit` | Passed |
| `npm run build` | Passed; unchanged 10 public package-detail routes prerendered |
| `npm run test:e2e` | 76 passed, 0 failed, 0 skipped, 0 flaky, no retries; 33.9 seconds |
| JSON coverage summary | 76 records, zero application JavaScript errors, zero inquiry POSTs |
| `git diff --check` | Passed |

Verified in the actual browser:

- Desktop navigation and mobile/tablet menus; keyboard-operated links and
  carousel controls with visible, unobscured focus.
- All 10 Colombia packages reachable through homepage carousel controls,
  forward and backward endpoints, and first/last package detail navigation.
  Homepage carousel and Colombia destination grid links match registry order.
  `/colombia` has a grid, not a separate carousel.
- `/packages/medellin-guatape` inquiry CTA carries canonical slug/destination to
  `/plan`; the actual selected name and Colombia remain visible.
- General, Egypt, Colombia and package-only planning; unknown, malformed,
  duplicate and mismatched selections. Reset and destination-correction links
  actually navigate to a state without the selection error. Unavailable-state
  entry fields and submit controls are absent.
- WhatsApp's configured target `https://wa.me/19177809875` and keyboard
  navigation under interception. No submitted/delivered inquiry confirmation.
  This proves the site's link behavior, not a real WhatsApp application handoff.
- Footer credit on `/`, `/colombia`, `/egypt`, the selected package and `/plan`:
  correct URL, `_blank`, `noopener noreferrer`, keyboard activation, a new
  intercepted browsing context and `window.opener === null`.
- Five absent-media Egypt fallbacks, stable 3:2 experience frames, retained
  headings/copy and no requests for known missing Egypt images. The real
  slideshow visits Cairo, Giza, Luxor and Aswan using controlled browser time,
  retaining original copy and fallbacks without source/component mocks.
- A deliberate browser image-request failure exercises the shared country hero
  on `/colombia`: actual image error swaps to a fallback without changing frame
  height or removing heading/subtitle. Egypt's missing images cannot exercise
  a failed-image request because they are correctly omitted at source.
- Purple-and-white destination bands retain existing 48px desktop, 32px tablet
  and 24px mobile section padding. Checked routes/carousel interactions do not
  introduce document-level horizontal overflow.

### Screenshots and Reproduction

Representative screenshots were captured and inspected for destination-section
transitions, first/last carousel states, Egypt hero/experience fallbacks,
general/selected planning, mobile/tablet menus, corrected region columns and
mobile contact controls, plus short-desktop focus clearance. Text wraps and
media frames remain intact in those inspected states; this is not exhaustive
visual coverage of every scroll position.

Generated locations, all ignored by Git:

- `playwright-report/index.html`: browser results and per-test coverage.
- `test-results/results.json`: machine-readable final results and attachments.
- `test-results/journey-*/`: screenshots, organized by test and viewport.
- Screenshot names include `homepage-destination-transition.png`,
  `colombia-carousel-first.png`, `colombia-carousel-last.png`,
  `egypt-hero-fallback.png`, `egypt-experience-fallbacks.png`,
  `plan-general-contact.png`, `plan-selected-contact.png`,
  `plan-contact-controls.png`, `colombia-regions.png` and
  `navigation-colombia.png`. Run `rg --files test-results -g '*.png'` for exact
  paths. Subsequent runs replace the generated report and screenshots.

Reproduce without live delivery:

```sh
npm test
npm run lint
npx --no-install tsc --noEmit
npm run build
npm run test:e2e
```

If port 3210 is occupied, use `E2E_PORT=3211 npm run test:e2e` after confirming
that port is available. Do not stop an unrelated process. For manual inspection,
serve the built application with
`npm run start -- --hostname 127.0.0.1 --port 3210` when the test server is stopped.

### Remaining Blockers and Unverified Checks

- Egypt still has **zero approved package records**. This is a content blocker,
  not completed Egypt package-carousel verification. No experiences were
  relabeled, packages invented or assets added. Missing original photographs
  remain optional enhancements; approved actual records remain required.
- No implemented lead backend, persistence or downstream delivery exists.
  Existing mocked acceptance/failure tests do not establish live delivery or
  configured-backend browser behavior.
- Real external WhatsApp handoff, Cleopatra's external page and Calendly loading
  were deliberately not verified. Intercepted navigation is not external-service
  success. No cross-browser or physical-device coverage.
- Manual **200% browser zoom remains unverified**: no interactive browser chrome
  was available to perform that check. Viewport emulation and controlled browser
  time are not browser zoom. Manual steps: start the production preview above;
  open `/`, `/colombia`, `/egypt` and both general/selected `/plan` in Chrome;
  set the browser's menu Zoom value to 200%; Tab through navigation/carousel and
  contact actions; inspect wrapping, header obstruction and horizontal overflow;
  do not submit forms or send messages; restore Zoom to 100% afterward.
- Additional observation outside the requested Egypt-media checks: `/about`
  references missing `/brand/ali.jpg` at `app/about/page.tsx:28`; the production
  image optimizer repeatedly reports an invalid image. Navigation itself passed,
  but that portrait is unresolved. No replacement photograph was invented.
- Installation reported seven dependency vulnerabilities (six high, one
  critical). No audit autofix or unrelated upgrades were run; advisory
  remediation was not assessed in this focused UI pass.

### Files Changed in This Follow-Up

- `.gitignore`, `eslint.config.mjs`: ignore generated browser artifacts.
- `package.json`, `package-lock.json`: development browser dependency and separate
  `test:e2e` script; no unrelated version changes.
- `playwright.config.ts`: production server, four viewports and reporters.
- `tests/e2e/fixtures.ts`: side-effect interception, diagnostics and browser assertions.
- `tests/e2e/journey.spec.ts`: focused journey, layout and media regressions.
- `app/globals.css`: only the three reproduced corrections described above.
- `docs/correction-batch.md`: substantive verification and remaining limits.
