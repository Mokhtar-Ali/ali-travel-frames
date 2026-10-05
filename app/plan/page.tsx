import type { Metadata } from "next";
import Script from "next/script";
import { PlanLeadForm } from "./PlanLeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappContactUrl } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { resolveInquirySelection } from "@/lib/inquiry-selection";
import { isLeadServiceAvailable } from "@/lib/lead-service";

const calendlyUrl =
  "https://calendly.com/mail-alitravelframes/30min?background_color=FBFAF7&text_color=0B1220&primary_color=4B0B63";

export const metadata: Metadata = buildMetadata({
  title: "Book a free 15-minute call",
  description:
    "Book a call or send Ali Travel Frames the details for a private Colombia or Egypt trip.",
  path: "/plan",
  noIndex: false,
});

type PlanPageProps = {
  searchParams: Promise<{
    c?: string | string[];
    package?: string | string[];
  }>;
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const selection = resolveInquirySelection(params.c, params.package);
  const leadServiceAvailable = isLeadServiceAvailable();

  return (
    <section className="page-section bg-paper">
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div className="section-inner">
        <div className="plan-page-intro">
          <p className="eyebrow">Start planning</p>
          <h1 className="display-title mt-5">Book a free 15-minute call</h1>
          <p className="mt-6 max-w-[54ch]">
            Choose a time to talk through the trip, the rough dates, and what
            would make it feel like yours.
          </p>
        </div>

        {!leadServiceAvailable ? (
          <PlanContactNotice
            selection={selection}
            requiresDestinationChoice={
              Array.isArray(params.c) ||
              (!selection.ok && selection.code === "INVALID_DESTINATION")
            }
          />
        ) : null}

        <div
          className="calendly-inline-widget calendly-embed mt-10"
          data-url={calendlyUrl}
        />

        {leadServiceAvailable ? (
          <div className="plan-form-section">
            <h2 className="section-title">Or send the details first</h2>
            <div className="plan-form-wrap mt-10">
              <PlanLeadForm
                key={JSON.stringify([params.c, params.package])}
                initialCountry={selection.country}
                initialPackage={selection.package}
                initialSelectionError={selection.ok ? "" : selection.error}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PlanContactNotice({
  selection,
  requiresDestinationChoice,
}: {
  selection: ReturnType<typeof resolveInquirySelection>;
  requiresDestinationChoice: boolean;
}) {
  const countryLabels = { colombia: "Colombia", egypt: "Egypt" };

  return (
    <div className="plan-form-section" aria-labelledby="plan-contact-title">
      <h2 id="plan-contact-title" className="section-title">
        Plan your journey with us
      </h2>
      <div className="plan-form-wrap mt-6">
        <p>
          Contact Ali Travel Frames on WhatsApp to discuss your trip while online
          inquiry submissions are unavailable.
        </p>
        <p className="plan-note mt-6">
          Destination:{" "}
          {requiresDestinationChoice
            ? "Please choose a destination"
            : countryLabels[selection.country]}
        </p>
        {selection.package ? (
          <div className="mt-6">
            <p className="eyebrow">Selected journey</p>
            <p className="mt-3">
              <strong>{selection.package.name}</strong>
            </p>
            <p className="plan-note mt-3">
              {countryLabels[selection.package.country]}
            </p>
          </div>
        ) : null}
        {!selection.ok ? (
          <p className="plan-error mt-6" role="alert">
            {selection.error}
          </p>
        ) : null}
        <ButtonLink href={whatsappContactUrl} className="mt-6 w-full sm:w-fit">
          Plan my trip on WhatsApp
        </ButtonLink>
        {selection.package || !selection.ok ? (
          <div className="mt-6 flex flex-wrap gap-4">
            {selection.package && !selection.ok ? (
              <ButtonLink
                href={`/plan?c=${selection.package.country}&package=${selection.package.slug}`}
                variant="quiet"
              >
                Choose {countryLabels[selection.package.country]} for this journey
              </ButtonLink>
            ) : null}
            {requiresDestinationChoice ? (
              <>
                <ButtonLink href="/plan?c=colombia" variant="quiet">
                  Continue with Colombia
                </ButtonLink>
                <ButtonLink href="/plan?c=egypt" variant="quiet">
                  Continue with Egypt
                </ButtonLink>
              </>
            ) : (
              <ButtonLink href={`/plan?c=${selection.country}`} variant="quiet">
                {selection.package
                  ? "Clear selected journey"
                  : "Continue with a general inquiry"}
              </ButtonLink>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
