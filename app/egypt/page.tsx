import type { Metadata } from "next";
import Image from "next/image";
import { CountryHero } from "@/components/CountryHero";
import { CountryReviews } from "@/components/CountryReviews";
import { Invitation } from "@/components/Invitation";
import { PackageGrid } from "@/components/PackageGrid";
import { egyptPackages } from "@/content/packages";
import { buildMetadata } from "@/lib/seo";

const experiences = [
  {
    name: "Cairo & Giza",
    image: "/egypt/cairo.jpg",
    description:
      "The pyramids, the Egyptian Museum, and the living city around them all need room to breathe.",
  },
  {
    name: "Luxor & Aswan",
    image: "/egypt/luxor.jpg",
    description:
      "Temples, tombs, and Upper Egypt work best at a pace that leaves time for the river.",
  },
  {
    name: "A Nile cruise",
    image: "/egypt/nile.jpg",
    description:
      "A slower way between the ancient sites, with the landscape doing half the work.",
  },
  {
    name: "The Red Sea",
    image: "/egypt/red-sea.jpg",
    description:
      "Clear water and unhurried days make a useful counterweight to the monuments.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Egypt Travel Planning | Ali Travel Frames",
  description:
    "Private Egypt travel planning from Cairo and the Nile to the Red Sea.",
  path: "/egypt",
  image: "/egypt/hero-1.jpg",
  imageAlt: "Egypt",
});

export default function EgyptPage() {
  return (
    <div className="bg-paper">
      {/* TODO: Add the Egypt hero images under /public/egypt/. */}
      <CountryHero
        title="Egypt"
        subtitle="Cairo, the Nile, Upper Egypt, and the Red Sea planned with first-hand judgment."
        image="/egypt/hero-1.jpg"
        imageAlt="Egypt"
      />

      <section className="page-section bg-paper">
        <div className="section-inner">
          <div className="country-statement">
            <p className="eyebrow">Why Egypt</p>
            <h2 className="section-title mt-4">
              The only other country on this site
            </h2>
            <p className="mt-6">
              Egypt is here for the same reason Colombia is: I know it through
              time spent on the ground, people I trust, and the practical
              details that decide whether a trip feels considered or merely
              booked. I would rather know two countries properly than sell a
              long list at arm&apos;s length.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Four ways into Egypt</p>
          <h2 className="section-title mt-4">Where the trip can take shape</h2>
          {/* TODO: Add cairo.jpg, luxor.jpg, nile.jpg, and red-sea.jpg under /public/egypt/. */}
          <div className="egypt-experience-grid mt-10">
            {experiences.map((experience) => (
              <article key={experience.name} className="egypt-experience">
                <div className="egypt-experience-image">
                  <Image
                    src={experience.image}
                    alt={experience.name}
                    width={1200}
                    height={800}
                    loading="lazy"
                    sizes="(max-width: 680px) 100vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="egypt-experience-copy">
                  <h3>{experience.name}</h3>
                  <p className="mt-3">{experience.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-paper">
        <div className="section-inner">
          <p className="eyebrow">Journeys</p>
          <h2 className="section-title mt-4">Egypt journeys</h2>
          <div className="mt-10">
            <PackageGrid packages={egyptPackages} />
          </div>
        </div>
      </section>

      <CountryReviews country="Egypt" />
      <Invitation country="Egypt" href="/plan?c=egypt" />
    </div>
  );
}
