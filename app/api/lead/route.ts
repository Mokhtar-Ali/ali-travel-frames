type LeadPayload = {
  source?: unknown;
  country?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  travelWindow?: unknown;
  travellerCount?: unknown;
  interests?: unknown;
  budgetPerPerson?: unknown;
  notes?: unknown;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const source = typeof payload.source === "string" ? payload.source : "guide";
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const requiresName = source === "plan";

  if (requiresName && name.length < 2) {
    return Response.json(
      { ok: false, error: "Name is required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 },
    );
  }

  const sanitizedLead = {
    source,
    country:
      typeof payload.country === "string" ? payload.country.trim() : "",
    name,
    email,
    phone: typeof payload.phone === "string" ? payload.phone.trim() : "",
    travelWindow:
      typeof payload.travelWindow === "string"
        ? payload.travelWindow.trim()
        : "",
    travellerCount:
      typeof payload.travellerCount === "number" ? payload.travellerCount : null,
    interests: Array.isArray(payload.interests)
      ? payload.interests.filter((interest) => typeof interest === "string")
      : [],
    budgetPerPerson:
      typeof payload.budgetPerPerson === "string"
        ? payload.budgetPerPerson
        : "",
    notes: typeof payload.notes === "string" ? payload.notes.trim() : "",
  };

  void sanitizedLead;

  // TODO: Add the Airtable lead write and Resend guide delivery email here.
  // Keep service credentials in environment variables; do not commit secrets.
  // Never log lead payloads in production.

  return Response.json({ ok: true });
}
