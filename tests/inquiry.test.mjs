import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource, componentHarness, findNodes, textContent } from "./helpers.mjs";

const { resolveInquirySelection } = loadSource("lib/inquiry-selection.ts");
const { validateLead } = loadSource("lib/lead.ts");
const { readLeadResponse } = loadSource("lib/lead-response.ts");
const { POST } = loadSource("app/api/lead/route.ts");
const selection = resolveInquirySelection("colombia", "medellin-guatape");
const baseLead = {
  source: "plan", country: "colombia", name: "Local Test",
  email: "local-test@example.invalid", travellerCount: 2, notes: "Keep these notes",
};

function formHarness(props, fetchMock) {
  return componentHarness("app/plan/PlanLeadForm.tsx", "PlanLeadForm", props, {
    fetch: fetchMock,
    FormData: class {
      constructor(form) { return form; }
    },
  });
}

function formData() {
  const data = new FormData();
  for (const [key, value] of Object.entries(baseLead)) data.set(key, String(value));
  data.set("interests", "Medellín");
  data.set("budgetPerPerson", "Not sure");
  return data;
}

function submit(tree, data = formData()) {
  return tree.props.onSubmit({ preventDefault() {}, currentTarget: data });
}

const submitButton = (tree) => findNodes(tree, (n) => n.props?.type === "submit")[0];

test("valid package URL resolves authoritative name and destination and displays them", async () => {
  assert.equal(selection.ok, true);
  assert.equal(selection.package.name, "Medellín & Guatapé");
  assert.equal(selection.package.slug, "medellin-guatape");
  assert.equal(selection.country, "colombia");
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null,
    "server-only": {},
  });
  const html = renderToStaticMarkup(await PlanPage({
    searchParams: Promise.resolve({ c: "colombia", package: "medellin-guatape" }),
  }));
  assert.match(html, /Selected journey/);
  assert.match(html, /Medellín &amp; Guatapé/);
  assert.match(html, /Plan your journey with us/);
  assert.match(html, /href="https:\/\/wa.me\/19177809875"/);
  assert.doesNotMatch(html, /<form|<input|<textarea|<select/);
});

test("unavailable service shows the exact notice and primary contact action before entry", async () => {
  const { isLeadServiceAvailable } = loadSource("lib/lead-service.ts", { "server-only": {} });
  assert.equal(isLeadServiceAvailable(), false);
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null, "server-only": {},
  });
  const tree = await PlanPage({ searchParams: Promise.resolve({ c: "egypt" }) });
  const html = renderToStaticMarkup(tree);
  assert.match(html, /Plan your journey with us/);
  assert.match(html, /Contact Ali Travel Frames on WhatsApp to discuss your trip while online inquiry submissions are unavailable\./);
  assert.match(html, /Destination: Egypt/);
  assert.match(html, /class="btn-primary[^\"]*"[^>]*>Plan my trip on WhatsApp<\/a>/);
  assert.doesNotMatch(html, /<form|<input|<textarea|<select|Or send the details first/);
  assert.ok(html.indexOf("plan-contact-title") < html.indexOf("calendly-inline-widget"));
  const notice = findNodes(tree, (n) => n.type?.name === "PlanContactNotice")[0];
  const action = findNodes(notice.type(notice.props), (n) => n.props?.href === "https://wa.me/19177809875")[0];
  assert.equal(action.props.onClick, undefined);
});

test("unavailable service preserves invalid-link handling and explicit correction links", async () => {
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null, "server-only": {},
  });
  for (const params of [
    { c: "egypt", package: "unknown-package" },
    { c: "egypt", package: "../medellin-guatape" },
    { c: "egypt", package: ["medellin-guatape", "coffee-region"] },
  ]) {
    const html = renderToStaticMarkup(await PlanPage({ searchParams: Promise.resolve(params) }));
    assert.match(html, /role="alert"/);
    assert.match(html, /href="\/plan\?c=egypt"[^>]*>Continue with a general inquiry<\/a>/);
    assert.doesNotMatch(html, /<form/);
  }
  for (const params of [{ c: ["colombia", "egypt"] }, { c: "peru" }]) {
    const html = renderToStaticMarkup(await PlanPage({ searchParams: Promise.resolve(params) }));
    assert.match(html, /Destination: Please choose a destination/);
    assert.match(html, /Continue with Colombia/);
    assert.match(html, /Continue with Egypt/);
    assert.match(html, /role="alert"/);
  }
});

test("unavailable mismatch keeps both destinations visible and resolves through explicit links", async () => {
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null, "server-only": {},
  });
  const html = renderToStaticMarkup(await PlanPage({
    searchParams: Promise.resolve({ c: "egypt", package: "medellin-guatape" }),
  }));
  assert.match(html, /Destination: Egypt/);
  assert.match(html, /Medellín &amp; Guatapé/);
  assert.match(html, /Colombia/);
  assert.match(html, /different destination/);
  assert.match(html, /href="\/plan\?c=colombia&amp;package=medellin-guatape"/);
  assert.match(html, /href="\/plan\?c=egypt"[^>]*>Clear selected journey<\/a>/);
  assert.doesNotMatch(html, /<form/);
  for (const params of [{ c: "colombia", package: "medellin-guatape" }, { c: "egypt" }]) {
    const corrected = renderToStaticMarkup(await PlanPage({ searchParams: Promise.resolve(params) }));
    assert.doesNotMatch(corrected, /role="alert"/);
  }
});

test("controlled available-backend dependency renders the preserved form and selection errors", async () => {
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null,
    "@/lib/lead-service": { isLeadServiceAvailable: () => true },
  });
  for (const params of [{ c: "colombia", package: "medellin-guatape" }, { c: "egypt" }]) {
    const html = renderToStaticMarkup(await PlanPage({ searchParams: Promise.resolve(params) }));
    assert.match(html, /<form/);
    assert.match(html, /Or send the details first/);
    assert.doesNotMatch(html, /Plan your journey with us/);
    if (params.package) assert.match(html, /name="package" value="medellin-guatape"/);
  }
  for (const params of [{ c: "egypt", package: "medellin-guatape" }, { package: "unknown" },
    { c: ["egypt", "colombia"] }]) {
    const html = renderToStaticMarkup(await PlanPage({ searchParams: Promise.resolve(params) }));
    assert.match(html, /role="alert"/);
    assert.match(html, /type="submit" disabled=""/);
  }
});

test("available rendering still retains inquiry fields and values after a mocked runtime failure", async () => {
  const { default: PlanPage } = loadSource("app/plan/page.tsx", {
    "next/script": () => null,
    "@/lib/lead-service": { isLeadServiceAvailable: () => true },
  });
  const tree = await PlanPage({
    searchParams: Promise.resolve({ c: "colombia", package: "medellin-guatape" }),
  });
  const form = findNodes(tree, (n) => n.type?.name === "PlanLeadForm")[0];
  const payloads = [];
  const h = formHarness(form.props, async (_url, init) => {
    payloads.push(JSON.parse(init.body));
    return Response.json({ ok: false }, { status: 500 });
  });
  const data = formData();
  await submit(h.render(), data);
  assert.equal(h.render().type, "form");
  assert.match(textContent(h.render()), /could not confirm/);
  assert.equal(findNodes(h.render(), (n) => n.props?.name === "notes").length, 1);
  await submit(h.render(), data);
  assert.deepEqual(payloads[0], payloads[1]);
  assert.equal(payloads[0].notes, baseLead.notes);
  assert.equal(payloads[0].package, "medellin-guatape");
});

test("general inquiry and package-only URL resolve without invented context", () => {
  assert.deepEqual(resolveInquirySelection(undefined, undefined), {
    ok: true, country: "colombia", package: null,
  });
  assert.equal(resolveInquirySelection("egypt", undefined).country, "egypt");
  assert.equal(resolveInquirySelection(undefined, "medellin-guatape").country, "colombia");
  const valid = validateLead(baseLead);
  assert.equal(valid.ok, true);
  assert.equal(valid.lead.package, null);
});

test("unknown, malformed, duplicate and conflicting selections are rejected", () => {
  for (const [country, slug, code] of [
    ["colombia", "unknown-package", "UNKNOWN_PACKAGE"],
    ["colombia", "../medellin-guatape", "INVALID_PACKAGE"],
    ["colombia", "", "INVALID_PACKAGE"],
    ["colombia", null, "INVALID_PACKAGE"],
    ["colombia", ["medellin-guatape", "medellin-guatape"], "DUPLICATE_SELECTION"],
    [["colombia", "egypt"], "medellin-guatape", "DUPLICATE_SELECTION"],
    ["egypt", "medellin-guatape", "PACKAGE_DESTINATION_MISMATCH"],
    ["peru", undefined, "INVALID_DESTINATION"],
  ]) {
    const result = resolveInquirySelection(country, slug);
    assert.equal(result.ok, false);
    assert.equal(result.code, code);
    const apiResult = validateLead({ ...baseLead, country, package: slug });
    assert.equal(apiResult.ok, false);
    assert.equal(apiResult.code, code);
  }
});

test("server ignores browser-supplied package names and prices", () => {
  const result = validateLead({
    ...baseLead, package: "medellin-guatape", packageName: "Fake name", priceFrom: 1,
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.lead.package, selection.package);
  assert.equal(result.lead.country, "colombia");
  assert.equal(Object.hasOwn(result.lead, "priceFrom"), false);
});

test("API returns explicit unavailable response for valid general, package and guide requests", async () => {
  for (const payload of [baseLead, { ...baseLead, package: "medellin-guatape" }, { email: baseLead.email }]) {
    const response = await POST(new Request("http://localhost/api/lead", {
      method: "POST", body: JSON.stringify(payload),
    }));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { ok: false, code: "LEAD_SERVICE_UNAVAILABLE" });
  }
});

test("API rejects invalid JSON, non-object payloads, invalid fields and package mismatch", async () => {
  for (const body of ["{", "null", "[]", "42", JSON.stringify({ ...baseLead, email: "invalid" }),
    JSON.stringify({ ...baseLead, name: "A" }), JSON.stringify({ ...baseLead, travellerCount: 1.5 }),
    JSON.stringify({ ...baseLead, package: "unknown" }),
    JSON.stringify({ ...baseLead, country: "egypt", package: "medellin-guatape" })]) {
    const response = await POST(new Request("http://localhost/api/lead", { method: "POST", body }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  }
});

test("form sends only the selected slug and keeps form data available after HTTP 503", async () => {
  const payloads = [];
  const h = formHarness({ initialCountry: "colombia", initialPackage: selection.package }, async (url, init) => {
    assert.equal(url, "/api/lead");
    payloads.push(JSON.parse(init.body));
    return Response.json({ ok: false, code: "LEAD_SERVICE_UNAVAILABLE" }, { status: 503 });
  });
  const data = formData();
  const pending = submit(h.render(), data);
  assert.equal(h.render().props["aria-busy"], true);
  assert.equal(submitButton(h.render()).props.disabled, true);
  await pending;
  const tree = h.render();
  assert.equal(tree.type, "form");
  assert.equal(tree.props["aria-busy"], false);
  assert.equal(findNodes(tree, (n) => n.props?.name === "notes").length, 1);
  assert.match(textContent(tree), /has not been submitted/);
  assert.equal(findNodes(tree, (n) => n.props?.role === "alert").length, 1);
  assert.equal(findNodes(tree, (n) => n.props?.href === "https://wa.me/19177809875").length, 1);
  assert.equal(findNodes(tree, (n) => n.props?.href === "https://wa.me/19177809875")[0].props.onClick, undefined);
  await submit(tree, data);
  assert.deepEqual(payloads[0], payloads[1]);
  assert.equal(payloads[0].notes, baseLead.notes);
  assert.equal(payloads[0].package, "medellin-guatape");
  assert.equal(Object.hasOwn(payloads[0], "packageName"), false);
});

test("general form submits without a package", async () => {
  let payload;
  const h = formHarness({ initialCountry: "egypt" }, async (_url, init) => {
    payload = JSON.parse(init.body);
    return Response.json({ ok: false, code: "LEAD_SERVICE_UNAVAILABLE" }, { status: 503 });
  });
  await submit(h.render());
  assert.equal(payload.country, "egypt");
  assert.equal(Object.hasOwn(payload, "package"), false);
});

test("changing destination blocks a selected package until corrected or explicitly cleared", async () => {
  let calls = 0;
  let payload;
  const h = formHarness({ initialCountry: "colombia", initialPackage: selection.package }, async (_url, init) => {
    calls++;
    payload = JSON.parse(init.body);
    return Response.json({ ok: false }, { status: 503 });
  });
  const choose = (country) => findNodes(h.render(), (n) => n.props?.type === "radio" && n.props.value === country)[0].props.onChange();
  choose("egypt");
  assert.equal(submitButton(h.render()).props.disabled, true);
  await submit(h.render());
  assert.equal(calls, 0);
  choose("colombia");
  assert.equal(submitButton(h.render()).props.disabled, false);
  choose("egypt");
  findNodes(h.render(), (n) => Boolean(n.props?.onClick))[0].props.onClick();
  assert.equal(submitButton(h.render()).props.disabled, false);
  assert.equal(findNodes(h.render(), (n) => n.props?.name === "package").length, 0);
  await submit(h.render());
  assert.equal(payload.country, "egypt");
  assert.equal(Object.hasOwn(payload, "package"), false);
});

test("invalid link requires an explicit reset and initial mismatch can be corrected", () => {
  const unknown = resolveInquirySelection("colombia", "unknown");
  const h = formHarness({ initialCountry: unknown.country, initialSelectionError: unknown.error }, () => {
    throw new Error("Must not submit");
  });
  assert.equal(submitButton(h.render()).props.disabled, true);
  findNodes(h.render(), (n) => Boolean(n.props?.onClick))[0].props.onClick();
  assert.equal(submitButton(h.render()).props.disabled, false);
  const mismatch = resolveInquirySelection("egypt", "medellin-guatape");
  const m = formHarness({ initialCountry: mismatch.country, initialPackage: mismatch.package, initialSelectionError: mismatch.error });
  assert.equal(submitButton(m.render()).props.disabled, true);
  findNodes(m.render(), (n) => n.props?.type === "radio" && n.props.value === "colombia")[0].props.onChange();
  assert.equal(submitButton(m.render()).props.disabled, false);
});

test("HTTP failure, bare mock success, malformed JSON and network failure never show confirmation", async () => {
  for (const fetchMock of [
    async () => Response.json({ ok: true, status: "accepted" }, { status: 500 }),
    async () => Response.json({ ok: false }, { status: 500 }),
    async () => Response.json({ ok: true }),
    async () => new Response("not JSON", { status: 200 }),
    async () => { throw new Error("Network failure"); },
  ]) {
    const h = formHarness({ initialCountry: "colombia" }, fetchMock);
    await submit(h.render());
    assert.equal(h.render().type, "form");
    assert.match(textContent(h.render()), /could not confirm/);
  }
});

test("mocked acceptance confirms acceptance without claiming email delivery", async () => {
  const h = formHarness({ initialCountry: "colombia" }, async () =>
    Response.json({ ok: true, status: "accepted", notification: "accepted" }));
  await submit(h.render());
  assert.equal(h.render().props.className, "plan-confirmation");
  assert.match(textContent(h.render()), /accepted\s+by Ali Travel Frames/);
  assert.doesNotMatch(textContent(h.render()), /delivered|on its way|one business day|I have/);
});

test("mocked persistence with notification failure confirms saved state and discourages duplicates", async () => {
  const h = formHarness({ initialCountry: "colombia" }, async () =>
    Response.json({ ok: true, status: "saved", notification: "failed" }));
  await submit(h.render());
  assert.match(textContent(h.render()), /saved\s+by Ali Travel Frames/);
  assert.match(textContent(h.render()), /notification could not be sent/);
  assert.match(textContent(h.render()), /do not submit again/);
});

test("application errors and unsupported successful statuses are not accepted", async () => {
  for (const payload of [{ ok: false }, { ok: true, status: "validated" },
    { ok: true, status: "accepted", notification: "delivered" }]) {
    assert.equal((await readLeadResponse(Response.json(payload))).ok, false);
  }
});

test("guide unavailable state retains its form and offers configured contact", async () => {
  const h = componentHarness("components/Guide.tsx", "Guide", {}, {
    FormData: class { constructor(form) { return form; } },
    fetch: async () => Response.json({ ok: false, code: "LEAD_SERVICE_UNAVAILABLE" }, { status: 503 }),
  });
  await submit(findNodes(h.render(), (n) => n.type === "form")[0]);
  assert.equal(findNodes(h.render(), (n) => n.type === "form").length, 1);
  assert.match(textContent(h.render()), /has not been submitted/);
  assert.doesNotMatch(textContent(h.render()), /guide is on its way/);
});
