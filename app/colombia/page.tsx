import type { Metadata } from "next";
import { CountryHero } from "@/components/CountryHero";
import { CountryReviews } from "@/components/CountryReviews";
import { Guide } from "@/components/Guide";
import { Invitation } from "@/components/Invitation";
import { PackageGrid } from "@/components/PackageGrid";
import { Regions } from "@/components/Regions";
import { colombiaPackages } from "@/content/packages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Colombia Travel Planning | Ali Travel Frames",
  description:
    "Private Colombia travel planning with published journeys, named hotels, and trusted local guides.",
  path: "/colombia",
  image: "/hero/01-cartagena.jpg",
  imageAlt: "Cartagena, Colombia",
});

export default function ColombiaPage() {
  return (
    <div className="bg-paper">
      <CountryHero
        title="Colombia"
        subtitle="Private routes planned from Colombia, with the pace and practical detail handled properly."
        image="/hero/01-cartagena.jpg"
        imageAlt="Cartagena, Colombia"
      />

      <section className="page-section bg-paper">
        <div className="section-inner">
          <div className="country-statement">
            <p className="eyebrow">Why Colombia</p>
            <h2 className="section-title mt-4">
              A country best understood from the ground
            </h2>
            <p className="mt-6">
              Colombia rewards a route built around real transfer times,
              regional character, and people worth travelling with. Living
              here means I can plan those details with first-hand judgment and
              stay accountable while you travel.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Regions</p>
          <h2 className="section-title mt-4">Five places to begin</h2>
          <Regions />
        </div>
      </section>

      <section className="page-section bg-paper">
        <div className="section-inner">
          <p className="eyebrow">Journeys</p>
          <h2 className="section-title mt-4">All Colombia journeys</h2>
          <div className="mt-10">
            <PackageGrid packages={colombiaPackages} />
          </div>
        </div>
      </section>

      <CountryReviews country="Colombia" />
      <Guide />
      <Invitation country="Colombia" href="/plan?c=colombia" />
    </div>
  );
}
