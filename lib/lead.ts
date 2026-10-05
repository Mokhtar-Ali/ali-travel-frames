import { resolveInquirySelection } from "@/lib/inquiry-selection";

export function validateLead(payload: unknown) {
  const invalid = (error: string, code = "INVALID_LEAD") => ({
    ok: false as const,
    code,
    error,
  });

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return invalid("Please provide the form details.");
  }

  const fields = payload as Record<string, unknown>;
  const source = fields.source === undefined ? "guide" : fields.source;
  if (source !== "plan" && source !== "guide") {
    return invalid("This submission type is not supported.");
  }

  const text = (field: unknown) =>
    typeof field === "string" ? field.trim() : "";
  const name = text(fields.name);
  const email = text(fields.email);
  if (source === "plan" && name.length < 2) {
    return invalid("Please enter a name with at least two characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return invalid("Please enter a valid email address.");
  }
  if (source === "plan" && fields.country === undefined) {
    return invalid("Please choose Colombia or Egypt.", "INVALID_DESTINATION");
  }

  const selection = resolveInquirySelection(fields.country, fields.package);
  if (!selection.ok) {
    return invalid(selection.error, selection.code);
  }
  if (source === "guide" && selection.package) {
    return invalid("Please use the trip inquiry form for a package.");
  }

  const travellerCount = fields.travellerCount;
  if (
    source === "plan" &&
    (!Number.isSafeInteger(travellerCount) ||
      typeof travellerCount !== "number" ||
      travellerCount < 1)
  ) {
    return invalid("Please enter a whole number of travellers, at least one.");
  }

  return {
    ok: true as const,
    lead: {
      source,
      country: source === "plan" ? selection.country : null,
      package: selection.package,
      name,
      email,
      phone: text(fields.phone),
      travelWindow: text(fields.travelWindow),
      travellerCount: source === "plan" ? (travellerCount as number) : null,
      interests: Array.isArray(fields.interests)
        ? fields.interests.filter((interest): interest is string =>
            typeof interest === "string",
          )
        : [],
      budgetPerPerson: text(fields.budgetPerPerson),
      notes: text(fields.notes),
    },
  };
}
