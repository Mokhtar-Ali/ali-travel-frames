import type { Metadata } from "next";
import Image from "next/image";
import { PackageCard } from "@/components/package-card";
import { getAllPackages, getFeaturedPackages } from "@/content/packages";
import { publicAssetExists } from "@/lib/public-assets";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Colombia Travel Packages",
    description:
      "Browse private Colombia travel packages from Ali Travel Frames, from classic first trips to coastal and rainforest itineraries.",
    path: "/packages",
  });
}

export default function PackagesPage() {
  const featuredPackages = getFeaturedPackages();
  const heroPackage = featuredPackages[0];
  const hasHeroImage = publicAssetExists(heroPackage?.heroImage);
  const heroTextColor = hasHeroImage ? "text-surface" : "text-ink";
  const featuredSlugs = new Set(
    featuredPackages.map((travelPackage) => travelPackage.slug),
  );
  const otherPackages = getAllPackages().filter(
    (travelPackage) => !featuredSlugs.has(travelPackage.slug),
  );

  return (
    <div>
      <section
        className={`relative isolate min-h-[520px] overflow-hidden bg-paper ${heroTextColor}`}
      >
        {hasHeroImage && heroPackage ? (
          <Image
            src={heroPackage.heroImage}
            alt={`${heroPackage.name} trip scene`}
            width={1600}
            height={1000}
            sizes="100vw"
            priority
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}
        {hasHeroImage ? (
          <div className="hero-image-overlay absolute inset-0 -z-10" />
        ) : null}
        <div className="site-gutter flex min-h-[520px] flex-col justify-start py-16 sm:py-20 lg:py-24">
          <p className="font-heading text-sm font-bold uppercase text-gold">
            Travel packages
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.04] sm:text-6xl">
            Colombia routes with room for your own rhythm
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8">
            Start with a curated route, then customise pacing, hotels, private
            guides, restaurant reservations, and the moments that make a trip
            feel unmistakably yours.
          </p>
        </div>
      </section>

      <section className="site-gutter py-14">
        <div>
          <p className="font-heading text-sm font-bold uppercase text-gold">
            Featured
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
            Traveler favorites
          </h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {featuredPackages.map((travelPackage, index) => (
            <PackageCard
              key={travelPackage.slug}
              travelPackage={travelPackage}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-hair bg-surface">
        <div className="site-gutter py-14">
          <div>
            <p className="font-heading text-sm font-bold uppercase text-gold">
              More routes
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
              Build from these next
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {otherPackages.map((travelPackage) => (
              <PackageCard
                key={travelPackage.slug}
                travelPackage={travelPackage}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
