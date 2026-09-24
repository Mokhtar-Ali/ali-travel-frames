"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/Button";

type Country = "Colombia" | "Egypt";

const countryOptions: Country[] = ["Colombia", "Egypt"];

const interestOptions: Record<Country, string[]> = {
  Colombia: [
    "Cartagena",
    "Medellín",
    "Coffee Region",
    "Santa Marta",
    "San Andrés",
    "Not sure yet",
  ],
  Egypt: [
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

export function PlanLeadForm({ initialCountry }: { initialCountry: Country }) {
  const [country, setCountry] = useState<Country>(initialCountry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const interests = formData.getAll("interests").map(String);

    const payload = {
      source: "plan",
      country,
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
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error ?? "Please check the form and try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage("Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="plan-confirmation" aria-live="polite">
        <p className="eyebrow">Request received</p>
        <h2 className="section-title mt-4">Thank you.</h2>
        <p className="mt-5">
          I have your trip notes and will reply personally, usually within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
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
                onChange={() => setCountry(option)}
              />
              <span>{option}</span>
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
          defaultValue="2"
        />
      </PlanField>

      <fieldset className="plan-field">
        <legend>Which parts of {country} interest you</legend>
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

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending" : "Send it"}
        </Button>
        <p className="plan-note mt-4">
          I reply personally, usually within one business day.
        </p>
        {errorMessage ? (
          <p className="plan-error mt-4" aria-live="polite">
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
