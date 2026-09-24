import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlanLeadForm } from "./PlanLeadForm";
import { buildMetadata } from "@/lib/seo";

const phoneLabel = "+1 (917) 780-9875";
const phoneHref = "tel:+19177809875";
export const metadata: Metadata = buildMetadata({
  title: "Plan a private trip",
  description:
    "Tell Ali Travel Frames what you have in mind for a private trip to Colombia or Egypt.",
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
  const heroImage =
    initialCountry === "Egypt" ? "/egypt/hero.jpg" : "/hero/06-santa-marta.jpg";
  const whatsappHref = `https://wa.me/19177809875?text=${encodeURIComponent(
    `Hi Ali Travel Frames, I would like help planning a private ${initialCountry} trip.`,
  )}`;

  return (
    <div className="bg-paper">
      <section className="plan-hero">
        <Image
          src={heroImage}
          alt={initialCountry === "Egypt" ? "Egypt" : "Santa Marta coastline in Colombia"}
          width={1800}
          height={1125}
          sizes="100vw"
          priority
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="hero-scrim" />
        <div className="section-inner plan-hero-content">
          <h1 className="display-title hero-title">
            Let&apos;s plan your {initialCountry} trip
          </h1>
          <p className="hero-subtitle">
            Share the rough shape and I will help turn it into a private route.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="section-inner plan-grid">
          <div>
            <PlanLeadForm initialCountry={initialCountry} />
          </div>
          <aside className="plan-next-panel" aria-label="What happens next">
            <h2>What happens next</h2>
            <ol className="plan-next-list">
              <li>Free 15-minute call</li>
              <li>I build the route</li>
              <li>Nothing is booked until you say go</li>
            </ol>
            <div className="plan-hairline" />
            <h2 className="plan-talk-title">Prefer to talk now?</h2>
            <div className="mt-4 grid gap-3">
              <Link href={whatsappHref} className="plan-contact-link">
                Message on WhatsApp
              </Link>
              <Link href={phoneHref} className="plan-contact-link">
                {phoneLabel}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
