type LeadOutcome =
  | {
      ok: true;
      status: "accepted" | "saved";
      notificationFailed: boolean;
    }
  | { ok: false; error: string };

export async function readLeadResponse(response: Response): Promise<LeadOutcome> {
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  const fields =
    result && typeof result === "object"
      ? (result as Record<string, unknown>)
      : {};

  if (response.status === 503 || fields.code === "LEAD_SERVICE_UNAVAILABLE") {
    return {
      ok: false,
      error:
        "Online submissions are unavailable right now. Your request has not been submitted. Please contact Ali Travel Frames on WhatsApp.",
    };
  }

  if (
    response.ok &&
    fields.ok === true &&
    (fields.status === "accepted" || fields.status === "saved") &&
    (fields.notification === undefined ||
      fields.notification === "not_requested" ||
      fields.notification === "accepted" ||
      fields.notification === "failed")
  ) {
    return {
      ok: true,
      status: fields.status,
      notificationFailed: fields.notification === "failed",
    };
  }

  return {
    ok: false,
    error:
      response.status === 400 && typeof fields.error === "string"
        ? fields.error
        : "We could not confirm your submission. Your details are still here. Please contact Ali Travel Frames on WhatsApp before trying again.",
  };
}
