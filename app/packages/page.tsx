import type { Metadata } from "next";
import { PackageCard } from "@/components/package-card";
import { getAllPackages, getFeaturedPackages } from "@/content/packages";
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
  const featuredSlugs = new Set(
    featuredPackages.map((travelPackage) => travelPackage.slug),
  );
  const otherPackages = getAllPackages().filter(
    (travelPackage) => !featuredSlugs.has(travelPackage.slug),
  );

  return (
    <div>
      <section className="bg-[#f2eadc]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
            Travel packages
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.04] text-[#1f3d35] sm:text-6xl">
            Colombia routes with room for your own rhythm
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-stone-700">
            Start with a curated route, then customise pacing, hotels, private
            guides, restaurant reservations, and the moments that make a trip
            feel unmistakably yours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
            Featured
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[#1f3d35]">
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

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div>
            <p className="font-heading text-sm font-bold uppercase text-[#2f628f]">
              More routes
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-[#1f3d35]">
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
