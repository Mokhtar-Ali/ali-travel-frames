"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { whatsappContactUrl } from "@/content/site";
import type { InquiryCountry, InquiryPackage } from "@/lib/inquiry-selection";
import { readLeadResponse } from "@/lib/lead-response";

type Country = InquiryCountry;

const countryOptions: Country[] = ["colombia", "egypt"];
const countryLabels = { colombia: "Colombia", egypt: "Egypt" };

const interestOptions: Record<Country, string[]> = {
  colombia: [
    "Cartagena",
    "Medellín",
    "Coffee Region",
    "Santa Marta",
    "San Andrés",
    "Not sure yet",
  ],
  egypt: [
    "Cairo & Giza",
    "Luxor & Aswan",
    "Nile cruise",
    "Red Sea",
    "Not sure yet",
  ],
};

const budgetOptions = [
  "Under $3,000",
  "$3,000-4,500",
  "$4,500-6,500",
  "$6,500+",
  "Not sure",
];

export function PlanLeadForm({
  initialCountry,
  initialPackage = null,
  initialSelectionError = "",
}: {
  initialCountry: Country;
  initialPackage?: InquiryPackage | null;
  initialSelectionError?: string;
}) {
  const [country, setCountry] = useState<Country>(initialCountry);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [selectionError, setSelectionError] = useState(initialSelectionError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState<{
    status: "accepted" | "saved";
    notificationFailed: boolean;
  } | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const correctionMessage =
    selectionError ||
    (selectedPackage && selectedPackage.country !== country
      ? "The selected package belongs to a different destination. Choose its destination or clear the package to continue."
      : "");

  useEffect(() => {
    if (confirmation) {
      confirmationRef.current?.focus();
    }
  }, [confirmation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || correctionMessage) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const interests = formData.getAll("interests").map(String);

    const payload = {
      source: "plan",
      country,
      package: selectedPackage?.slug,
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      travelWindow: String(formData.get("travelWindow") ?? "").trim(),
      travellerCount: Number(formData.get("travellerCount") ?? 2),
      interests,
      budgetPerPerson: String(formData.get("budgetPerPerson") ?? ""),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await readLeadResponse(response);

      if (!result.ok) {
        setErrorMessage(result.error);
        return;
      }

      setConfirmation(result);
    } catch {
      setErrorMessage(
        "We could not confirm your submission. Your details are still here. Please contact Ali Travel Frames on WhatsApp before trying again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div
        className="plan-confirmation"
        role="status"
        tabIndex={-1}
        ref={confirmationRef}
      >
        <p className="eyebrow">Inquiry {confirmation.status}</p>
        <h2 className="section-title mt-4">Thank you.</h2>
        <p className="mt-5">
          Your trip inquiry has been {confirmation.status} by Ali Travel Frames.
        </p>
        {confirmation.notificationFailed ? (
          <p className="mt-5">
            The notification could not be sent. Please do not submit again;
            you can contact us on WhatsApp.
          </p>
        ) : null}
        <p className="mt-5">
          <a href={whatsappContactUrl} className="plan-contact-link">
            Contact Ali Travel Frames on WhatsApp
          </a>
        </p>
      </div>
    );
  }

  return (
    <form className="plan-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <fieldset className="plan-fields" disabled={isSubmitting}>
        {selectedPackage ? (
          <div>
            <p className="eyebrow">Selected journey</p>
            <p className="mt-3">
              <strong>{selectedPackage.name}</strong>
            </p>
            <p className="plan-note mt-3">
              {countryLabels[selectedPackage.country]}
            </p>
            <input type="hidden" name="package" value={selectedPackage.slug} />
          </div>
        ) : null}
        {correctionMessage ? (
          <p className="plan-error" role="alert">
            {correctionMessage}
          </p>
        ) : null}
        {selectedPackage || selectionError ? (
          <Button
            variant="quiet"
            className="w-fit"
            onClick={() => {
              setSelectedPackage(null);
              setSelectionError("");
              setErrorMessage("");
            }}
          >
            {selectedPackage
              ? "Clear selected journey"
              : "Continue with a general inquiry"}
          </Button>
        ) : null}
        <fieldset className="plan-field">
          <legend>Where are you going?</legend>
          <div className="plan-country-options">
            {countryOptions.map((option) => (
              <label key={option} className="plan-country-option">
                <input
                  name="country"
                  type="radio"
                  value={option}
                  checked={country === option}
                  onChange={() => {
                    setCountry(option);
                    setErrorMessage("");
                    if (selectedPackage) setSelectionError("");
                  }}
                />
                <span>{countryLabels[option]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <PlanField label="Name" htmlFor="plan-name">
          <input
            id="plan-name"
            className="lead-input"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            required
          />
        </PlanField>

        <PlanField label="Email" htmlFor="plan-email">
          <input
            id="plan-email"
            className="lead-input"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </PlanField>

        <PlanField label="Phone / WhatsApp" htmlFor="plan-phone">
          <input
            id="plan-phone"
            className="lead-input"
            name="phone"
            type="tel"
            autoComplete="tel"
          />
        </PlanField>

        <PlanField label="Roughly when" htmlFor="plan-travel-window">
          <input
            id="plan-travel-window"
            className="lead-input"
            name="travelWindow"
            type="text"
            placeholder="March 2027, or not sure yet"
          />
        </PlanField>

        <PlanField label="How many travellers" htmlFor="plan-travellers">
          <input
            id="plan-travellers"
            className="lead-input"
            name="travellerCount"
            type="number"
            min="1"
            step="1"
            required
            defaultValue="2"
          />
        </PlanField>

        <fieldset key={country} className="plan-field">
          <legend>Which parts of {countryLabels[country]} interest you</legend>
          <div className="plan-checkbox-row">
            {interestOptions[country].map((option) => (
              <label key={option} className="plan-checkbox">
                <input name="interests" type="checkbox" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <PlanField label="Budget per person" htmlFor="plan-budget">
          <select
            id="plan-budget"
            className="lead-input"
            name="budgetPerPerson"
            defaultValue="Not sure"
          >
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </PlanField>

        <PlanField label="Anything else" htmlFor="plan-notes">
          <textarea
            id="plan-notes"
            className="lead-input plan-textarea"
            name="notes"
            rows={4}
          />
        </PlanField>
      </fieldset>

      <div>
        <Button
          type="submit"
          disabled={isSubmitting || Boolean(correctionMessage)}
        >
          {isSubmitting ? "Sending" : "Send it"}
        </Button>
        <p className="plan-note mt-4" role="status">
          {isSubmitting ? "Submitting your trip inquiry..." : ""}
        </p>
        <a href={whatsappContactUrl} className="plan-contact-link">
          Contact Ali Travel Frames on WhatsApp
        </a>
        {errorMessage ? (
          <p className="plan-error mt-4" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function PlanField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="plan-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
