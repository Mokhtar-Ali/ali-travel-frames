import type { Metadata } from "next";
import Script from "next/script";
import { PlanLeadForm } from "./PlanLeadForm";
import { buildMetadata } from "@/lib/seo";

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
  searchParams: Promise<{ c?: string | string[] }>;
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const countryParam = Array.isArray(params.c) ? params.c[0] : params.c;
  const initialCountry = countryParam === "egypt" ? "Egypt" : "Colombia";

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

        <div
          className="calendly-inline-widget calendly-embed mt-10"
          data-url={calendlyUrl}
        />

        <div className="plan-form-section">
          <h2 className="section-title">Or send the details first</h2>
          <div className="plan-form-wrap mt-10">
            <PlanLeadForm initialCountry={initialCountry} />
          </div>
        </div>
      </div>
    </section>
  );
}
