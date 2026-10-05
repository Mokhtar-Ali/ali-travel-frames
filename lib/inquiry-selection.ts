import { getPackage } from "@/content/packages";
import type { Package } from "@/content/types";

export type InquiryCountry = Package["country"];
export type InquiryPackage = Pick<Package, "slug" | "name" | "country">;

type SelectionContext = {
  country: InquiryCountry;
  package: InquiryPackage | null;
};

type InquirySelection = SelectionContext &
  ({ ok: true } | { ok: false; code: string; error: string });

export function resolveInquirySelection(
  countryInput: unknown,
  packageInput: unknown,
): InquirySelection {
  const country =
    typeof countryInput === "string" ? countryInput.toLowerCase() : undefined;
  const context: SelectionContext = {
    country: country === "egypt" ? "egypt" : "colombia",
    package: null,
  };
  const invalid = (code: string, error: string): InquirySelection => ({
    ...context,
    ok: false,
    code,
    error,
  });

  if (Array.isArray(countryInput) || Array.isArray(packageInput)) {
    return invalid(
      "DUPLICATE_SELECTION",
      "This link contains more than one destination or package. Please start a general inquiry or return to a journey page.",
    );
  }

  if (
    countryInput !== undefined &&
    country !== "colombia" &&
    country !== "egypt"
  ) {
    return invalid("INVALID_DESTINATION", "Please choose Colombia or Egypt.");
  }

  if (packageInput === undefined) {
    return { ...context, ok: true };
  }

  if (
    typeof packageInput !== "string" ||
    packageInput.length > 120 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packageInput)
  ) {
    return invalid(
      "INVALID_PACKAGE",
      "This package link is invalid. Please return to a journey page or start a general inquiry.",
    );
  }

  const travelPackage = getPackage(packageInput);
  if (!travelPackage) {
    return invalid(
      "UNKNOWN_PACKAGE",
      "This package is not available. Please return to a journey page or start a general inquiry.",
    );
  }

  context.package = {
    slug: travelPackage.slug,
    name: travelPackage.name,
    country: travelPackage.country,
  };
  if (countryInput === undefined) {
    context.country = travelPackage.country;
  } else if (context.country !== travelPackage.country) {
    return invalid(
      "PACKAGE_DESTINATION_MISMATCH",
      "The selected package belongs to a different destination. Choose its destination or clear the package to continue.",
    );
  }

  return { ...context, ok: true };
}
