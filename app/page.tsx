import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Film } from "@/components/Film";
import { Guide } from "@/components/Guide";
import { Hero } from "@/components/Hero";
import { InTheirWords } from "@/components/InTheirWords";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { packages } from "@/content/packages/index";
import { formatUsd } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

const featuredJourneys = packages.slice(0, 6);

const regions = [
  {
    name: "Cartagena",
    slug: "cartagena",
    image: "/destinations/cartagena.jpg",
  },
  {
    name: "Medellin",
    slug: "medellin",
    image: "/destinations/medellin.jpg",
  },
  {
    name: "Coffee Region",
    slug: "coffee-region",
    image: "/destinations/coffee-region.jpg",
  },
  {
    name: "Santa Marta",
    slug: "santa-marta",
    image: "/destinations/santa-marta.jpg",
  },
  {
    name: "San Andres",
    slug: "san-andres",
    image: "/destinations/san-andres.jpg",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Private Colombia Travel Planning",
  description:
    "Tailored Colombia itineraries with boutique hotels, private guides, and calm planning from Ali Travel Frames.",
  path: "/",
});

export default function Home() {
  return (
    <div className="bg-paper">
      <Hero />
      <Statement />
      <Journeys />
      <Regions />
      <AliSection />
      <InTheirWords />
      <Film />
      <Guide />
      <Invitation />
    </div>
  );
}

function Statement() {
  return (
    <Reveal id="statement" className="home-section bg-paper">
      <div className="section-inner">
        <div className="statement-copy">
          <p className="eyebrow">Colombia only</p>
          <div className="mt-10 grid gap-8 text-[20px] leading-[1.8] text-ink">
            <p>
              Ali Travel Frames is run by an American who lives in Colombia, so
              your trip is planned from the ground, not from a distant desk.
            </p>
            <p>
              This is one country, studied slowly: the Caribbean coast, the
              coffee mountains, Medellin, Cartagena, and the human details that
              make the logistics feel easy.
            </p>
            <p>
              When something needs a real answer, you are not passed through a
              funnel. You get a person who answers the phone.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Journeys() {
  return (
    <Reveal className="home-section bg-paper">
      <div className="section-inner">
        <p className="eyebrow">Journeys</p>
        <h2 className="section-title mt-4">Ten journeys</h2>
        <p className="mt-5 max-w-[54ch]">
          Start with a proven route, then tune the pace, hotels, guides, and
          quiet time around how you actually like to travel.
        </p>
        <div className="journeys-grid mt-20">
          {featuredJourneys.map((journey, index) => (
            <Link
              key={journey.slug}
              href={`/packages/${journey.slug}`}
              className="journey-entry group"
            >
              <div className="media-frame journey-image">
                <Image
                  src={`/packages/${journey.slug}/hero.jpg`}
                  alt={`${journey.name} in Colombia`}
                  width={900}
                  height={1125}
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 899px) 100vw, 50vw"
                  className="media-scale h-full w-full object-cover"
                />
              </div>
              <div className="journey-copy">
                <p className="eyebrow">
                  {journey.nights} nights / {journey.cities.join(", ")}
                </p>
                <h3 className="mt-4">{journey.name}</h3>
                <p className="text-clamp-1 mt-3 text-[15px] leading-[1.6] text-ink-2">
                  {journey.summary}
                </p>
                <p className="mt-4 text-[15px] font-medium leading-[1.6] text-ink">
                  From {formatUsd(journey.priceFrom)} per person
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-20 text-center">
          <ButtonLink href="/packages" variant="quiet">
            All ten journeys
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}

function Regions() {
  return (
    <Reveal className="home-section bg-sand">
      <div className="section-inner">
        <p className="eyebrow">Regions</p>
        <h2 className="section-title mt-4 max-w-[14ch]">
          Five places to begin
        </h2>
        <div className="regions-grid mt-16">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/packages?region=${region.slug}`}
              className="region-card group"
            >
              <Image
                src={region.image}
                alt={`${region.name} Colombia`}
                width={600}
                height={800}
                loading="lazy"
                sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, (max-width: 1100px) 33vw, 20vw"
                className="media-scale h-full w-full object-cover"
              />
              <div className="region-scrim" />
              <h3 className="absolute bottom-5 left-5 text-[20px] leading-none text-white">
                {region.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function AliSection() {
  return (
    <Reveal className="home-section bg-paper">
      <div className="section-inner ali-grid">
        <div className="media-frame aspect-[4/5] bg-sand">
          {/* TODO: Replace this Medellin placeholder with a portrait of Ali. */}
          <Image
            src="/hero/03-medellin.jpg"
            alt="Ali in Colombia placeholder"
            width={900}
            height={1125}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Who plans your trip</p>
          <h2 className="section-title mt-4 max-w-[14ch]">
            Planned by someone who lives it
          </h2>
          <div className="mt-8 grid gap-6">
            <p>
              I plan Colombia trips from Colombia, which means the details are
              checked against real streets, real transfer times, and real
              people I can call.
            </p>
            <p>
              My work is to keep the trip calm without making it generic:
              enough structure to feel held, enough space for the country to
              surprise you.
            </p>
          </div>
          <ButtonLink href="/about" variant="quiet" className="mt-10">
            About Ali
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}

function Invitation() {
  return (
    <Reveal className="invitation-section bg-paper">
      <div className="section-inner text-center">
        <h2 className="display-title mx-auto max-w-[12ch]">
          Bring me the trip you keep imagining
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch]">
          We will turn the rough idea into a Colombia plan with rhythm, taste,
          and a real point of view.
        </p>
        <ButtonLink href="/plan" className="mt-10">
          Plan a trip
        </ButtonLink>
      </div>
    </Reveal>
  );
}
