import type { Metadata } from "next";
import { PackageGrid } from "@/components/PackageGrid";
import { colombiaPackages, egyptPackages } from "@/content/packages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Colombia Packages & Egypt Travel Planning | Ali Travel Frames",
  description:
    "Browse published private Colombia journeys and discuss a tailor-made Egypt trip with Ali Travel Frames. Shape the pace, hotels, and guides around you.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <div className="bg-paper">
      <section className="page-section">
        <div className="section-inner">
          <p className="eyebrow">Journeys</p>
          <h1 className="display-title mt-5 max-w-[14ch]">
            Colombia and Egypt journeys
          </h1>
          <p className="mt-7 max-w-[58ch]">
            Begin with a published route, then shape the pace, hotels, guides,
            meals, and downtime around the way you travel.
          </p>
        </div>
      </section>

      <section className="page-section border-t border-line bg-paper">
        <div className="section-inner">
          <p className="eyebrow">Colombia</p>
          <h2 className="section-title mt-4">Colombia journeys</h2>
          <div className="mt-10">
            <PackageGrid packages={colombiaPackages} />
          </div>
        </div>
      </section>

      <section className="page-section bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Egypt</p>
          <h2 className="section-title mt-4">Egypt journeys</h2>
          <div className="mt-10">
            <PackageGrid packages={egyptPackages} />
          </div>
        </div>
      </section>
    </div>
  );
}
