import type { Metadata } from "next";
import { PackageCard } from "@/components/package-card";
import { getAllPackages, getFeaturedPackages } from "@/content/packages/index";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Colombia Travel Packages",
    description:
      "Browse private Colombia travel packages from Ali Travel Frames, from classic first trips to coastal and island itineraries.",
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
  const orderedPackages = [...featuredPackages, ...otherPackages];

  return (
    <div className="bg-paper">
      <section className="page-section">
        <div className="section-inner">
          <p className="eyebrow">Journeys</p>
          <h1 className="display-title mt-5 max-w-[12ch]">
            Ten Colombia journeys
          </h1>
          <p className="mt-7 max-w-[58ch]">
            Start with one of these routes, then shape the pace, hotels, guides,
            islands, dinners, and downtime around the way you travel.
          </p>
          <div className="mt-24 grid gap-16">
            {orderedPackages.map((travelPackage) => (
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
