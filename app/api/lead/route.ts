import { validateLead } from "@/lib/lead";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const validation = validateLead(payload);
  if (!validation.ok) {
    return Response.json(validation, { status: 400 });
  }

  // No approved persistence or delivery integration is implemented.
  // Validation alone must never acknowledge an inquiry as accepted or saved.
  return Response.json(
    { ok: false, code: "LEAD_SERVICE_UNAVAILABLE" },
    { status: 503 },
  );
}
