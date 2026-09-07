import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PackageCard } from "@/components/package-card";
import { getFeaturedPackages } from "@/content/packages";
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

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-[#17382f] text-white">
        {heroPackage ? (
          <Image
            src={heroPackage.heroImage.src}
            alt={heroPackage.heroImage.alt}
            width={heroPackage.heroImage.width}
            height={heroPackage.heroImage.height}
            sizes="100vw"
            priority
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-[#17382f]/68" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="font-heading text-sm font-bold uppercase text-[#f2c16b]">
            Colombia, privately framed
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-[1.04] sm:text-6xl">
            Private Colombia trips designed frame by frame
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
            Boutique hotels, trusted private guides, and thoughtful pacing for
            travelers who want Colombia to feel vivid, personal, and easy.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100">
            Start with a proven route, then tune the hotel style, meal rhythm,
            private guiding, and downtime around the way you actually like to
            travel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/packages"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#f2c16b] px-5 py-3 font-heading text-sm font-bold text-[#17382f] transition hover:bg-white"
            >
              View packages
            </Link>
            <Link
              href="/plan"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-[#17382f]"
            >
              Book a free call
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
              Featured packages
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-[#1f3d35]">
              Ready-to-customise Colombia routes
            </h2>
          </div>
          <Link
            href="/packages"
            className="font-heading text-sm font-bold text-[#1f5f4a] underline decoration-[#f2c16b] decoration-2 underline-offset-4"
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
