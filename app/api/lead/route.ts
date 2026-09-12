type LeadPayload = {
  email?: unknown;
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

  const email = typeof payload.email === "string" ? payload.email.trim() : "";

  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 },
    );
  }

  // TODO: Add the Airtable lead write and Resend guide delivery email here.
  // Keep service credentials in environment variables; do not commit secrets.

  return Response.json({ ok: true });
}
