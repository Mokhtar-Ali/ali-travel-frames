import type { Metadata } from "next";
import Image from "next/image";
import { Film } from "@/components/Film";
import { Guide } from "@/components/Guide";
import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { InTheirWords } from "@/components/InTheirWords";
import { PackageCarousel } from "@/components/PackageCarousel";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { colombiaPackages, egyptPackages } from "@/content/packages";
import type { Package } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

const companyIntroduction = [
  "At Ali Travel Frames, we bring together VIP travel planning, personal concierge service, and trusted local expertise to shape journeys around you. From private Egypt tours to tailor-made Colombia travel packages, we plan the stays, guides, transfers, and experiences that make each trip feel personal.",
  "100+ travelers have trusted us with their journeys. We help our clients turn travel ideas into thoughtfully coordinated experiences, with clear communication, personal attention, and support throughout their trip.",
  "Our concierge and security services put comfort and safety-conscious planning at the heart of your journey. From arrival arrangements to your journey home, we help you navigate unfamiliar places with greater confidence and spend more time enjoying the experience.",
];

export const metadata: Metadata = buildMetadata({
  title: "Ali Travel Frames | Private Colombia & Egypt Travel Planning",
  description: "Private travel planning for Colombia and Egypt",
  path: "/",
});

export default function Home() {
  return (
    <div className="bg-paper">
      <Hero />
      <CountryJourneys
        country="colombia"
        eyebrow="Colombia"
        title="Colombia, planned from Colombia"
        copy={[
          "Private routes built around the pace, places, and people that make the country worth crossing.",
          "Start with a published journey, then shape the hotels, guides, meals, and quiet time around you.",
        ]}
        packages={colombiaPackages}
        linkLabel="All Colombia journeys"
        href="/colombia"
      />
      <CountryJourneys
        country="egypt"
        eyebrow="Egypt"
        title="Egypt, known on the ground"
        copy={[
          "Cairo, the Nile, Upper Egypt, and the Red Sea arranged with first-hand judgment.",
        ]}
        packages={egyptPackages}
        linkLabel="All Egypt journeys"
        href="/egypt"
        tone="sand"
      />
      <AliSection />
      <InTheirWords />
      <Film />
      <Guide />
      <Invitation />
    </div>
  );
}

function CountryJourneys({
  country,
  eyebrow,
  title,
  copy,
  packages,
  linkLabel,
  href,
  tone = "paper",
}: {
  country: Package["country"];
  eyebrow: string;
  title: string;
  copy: string[];
  packages: Package[];
  linkLabel: string;
  href: string;
  tone?: "paper" | "sand";
}) {
  return (
    <Reveal className={`home-section country-journeys-section bg-${tone}`}>
      <div className="section-inner country-journeys-inner">
        <div className="country-section-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title mt-4">{title}</h2>
          <div className="country-section-copy mt-6">
            {copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <PackageCarousel country={country} packages={packages} />
        <ButtonLink href={href} variant="quiet" className="country-journeys-link">
          {linkLabel}
        </ButtonLink>
      </div>
    </Reveal>
  );
}

function AliSection() {
  return (
    <Reveal className="home-section ali-section bg-paper">
      <div className="section-inner">
        <p className="eyebrow">Who plans your trip?</p>
        <h2 className="section-title mt-4">The team behind your journey</h2>
        <div className="ali-grid mt-10">
          <div className="media-frame ali-image bg-sand">
            <Image
              src="https://pub-ec6b76c0eef842d1bd7d65492c044988.r2.dev/Ali%20Travel%20Frames/Me-in-Colombia.jpg"
              alt="A group in colorful dress outside a historic building"
              width={1366}
              height={2048}
              sizes="(max-width: 899px) calc(100vw - 48px), 430px"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="ali-company-copy">
              {companyIntroduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="about-actions mt-10">
              <ButtonLink href="/plan">Plan my trip</ButtonLink>
              <ButtonLink href="/about" variant="quiet">
                About Ali
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
