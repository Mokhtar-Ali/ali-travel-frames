import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PackageCard } from "@/components/package-card";
import { getFeaturedPackages } from "@/content/packages";
import { publicAssetExists } from "@/lib/public-assets";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Private Colombia Travel Planning",
  description:
    "Tailored Colombia itineraries with boutique hotels, private guides, and calm planning from Ali Travel Frames.",
  path: "/",
});

export default function Home() {
  const featuredPackages = getFeaturedPackages();
  const heroPackage = featuredPackages[0];
  const hasHeroImage = publicAssetExists(heroPackage?.heroImage);
  const heroTextColor = hasHeroImage ? "text-surface" : "text-ink";

  return (
    <div>
      <section
        className={`relative isolate min-h-[560px] overflow-hidden bg-paper ${heroTextColor}`}
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
        <div className="site-gutter flex min-h-[560px] flex-col justify-start py-16 sm:py-20 lg:py-24">
          <p className="font-heading text-sm font-bold uppercase text-gold">
            Colombia, privately framed
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-[1.04] sm:text-6xl">
            Private Colombia trips designed frame by frame
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
            Boutique hotels, trusted private guides, and thoughtful pacing for
            travelers who want Colombia to feel vivid, personal, and easy.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7">
            Start with a proven route, then tune the hotel style, meal rhythm,
            private guiding, and downtime around the way you actually like to
            travel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/packages"
              className="btn-primary"
            >
              View packages
            </Link>
            <Link
              href="/plan"
              className="btn-secondary"
            >
              Book a free call
            </Link>
          </div>
        </div>
      </section>

      <section className="site-gutter py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-heading text-sm font-bold uppercase text-gold">
              Featured packages
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
              Ready-to-customise Colombia routes
            </h2>
          </div>
          <Link
            href="/packages"
            className="font-heading text-sm font-bold text-ink underline decoration-gold decoration-2 underline-offset-4"
          >
            See all packages
          </Link>
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
    </div>
  );
}
