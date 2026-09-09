import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import {
  getAllPackageSlugs,
  getPackageBySlug,
  type Package,
} from "@/content/packages";
import { formatUsd } from "@/lib/format";
import { publicAssetExists } from "@/lib/public-assets";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const travelPackage = getPackageBySlug(slug);

  if (!travelPackage) {
    return buildMetadata({
      title: "Package not found",
      description: "This Ali Travel Frames package could not be found.",
      path: `/packages/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: travelPackage.title,
    description: travelPackage.metaDescription,
    path: `/packages/${travelPackage.slug}`,
    image: travelPackage.heroImage,
    imageAlt: `${travelPackage.name} trip scene`,
  });
}

function buildTouristTripJsonLd(travelPackage: Package) {
  const packageUrl = `${SITE_URL}/packages/${travelPackage.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: travelPackage.name,
    description: travelPackage.summary,
    image: `${SITE_URL}${travelPackage.heroImage}`,
    url: packageUrl,
    provider: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: SITE_URL,
    },
    touristType: "Private Colombia travelers",
    itinerary: travelPackage.itinerary.map((day) => ({
      "@type": "CreativeWork",
      name: `Day ${day.day}: ${day.title}`,
      description: day.body,
    })),
    offers: {
      "@type": "Offer",
      price: travelPackage.priceFrom,
      priceCurrency: "USD",
      url: packageUrl,
      availability: "https://schema.org/InStock",
    },
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const travelPackage = getPackageBySlug(slug);

  if (!travelPackage) {
    notFound();
  }

  const hasHeroImage = publicAssetExists(travelPackage.heroImage);
  const heroTextColor = hasHeroImage ? "text-surface" : "text-ink";
  const touristTripJsonLd = buildTouristTripJsonLd(travelPackage);

  return (
    <>
      <JsonLd
        id={`${travelPackage.slug}-tourist-trip-json-ld`}
        data={touristTripJsonLd}
      />
      <article>
        <section
          className={`relative isolate min-h-[620px] overflow-hidden bg-paper ${heroTextColor}`}
        >
          {hasHeroImage ? (
            <Image
              src={travelPackage.heroImage}
              alt={`${travelPackage.name} trip scene`}
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
          <div className="site-gutter flex min-h-[620px] flex-col justify-start py-16 sm:py-20 lg:py-24">
            <p className="font-heading text-sm font-bold uppercase text-gold">
              {travelPackage.nights} nights
            </p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.02] sm:text-7xl">
              {travelPackage.name}
            </h1>
            <p className="mt-5 font-heading text-2xl font-bold">
              From {formatUsd(travelPackage.priceFrom)} per person
            </p>
            <p className="mt-5 max-w-2xl text-xl leading-8">
              {travelPackage.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/plan"
                className="btn-primary"
              >
                Book a free 15-minute call
              </Link>
              <Link
                href={`/plan?package=${travelPackage.slug}`}
                className="btn-secondary"
              >
                Customise this trip
              </Link>
            </div>
          </div>
        </section>

        <section className="site-gutter py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <p className="font-heading text-sm font-bold uppercase text-gold">
              Summary
            </p>
            <p className="text-2xl leading-10 text-ink">
              {travelPackage.summary}
            </p>
          </div>
        </section>

        <section className="border-y border-hair bg-surface">
          <div className="site-gutter py-14">
            <div className="max-w-3xl">
              <p className="font-heading text-sm font-bold uppercase text-gold">
                Day by day
              </p>
              <h2 className="mt-2 font-heading text-4xl font-bold text-ink">
                Itinerary
              </h2>
            </div>
            <ol className="mt-9 grid gap-5">
              {travelPackage.itinerary.map((day) => (
                <li
                  key={day.day}
                  className="grid gap-4 rounded-lg border border-hair bg-paper p-5 sm:grid-cols-[6rem_1fr]"
                >
                  <div className="font-heading text-sm font-bold uppercase text-gold">
                    Day {day.day}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-ink">
                      {day.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-ink">
                      {day.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="site-gutter py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-hair bg-surface p-6">
              <h2 className="font-heading text-3xl font-bold text-ink">
                What&apos;s included
              </h2>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-ink">
                {travelPackage.included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-hair bg-surface p-6">
              <h2 className="font-heading text-3xl font-bold text-ink">
                Not included
              </h2>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-ink">
                {travelPackage.excluded.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-hair bg-gold-soft">
          <div className="site-gutter py-14">
            <div className="max-w-3xl">
              <p className="font-heading text-sm font-bold uppercase text-gold">
                Hotels
              </p>
              <h2 className="mt-2 font-heading text-4xl font-bold text-ink">
                Named hotel shortlist
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {travelPackage.hotels.map((hotel) => (
                <article
                  key={`${hotel.city}-${hotel.name}`}
                  className="rounded-lg border border-hair bg-surface p-5"
                >
                  <p className="font-heading text-sm font-bold uppercase text-gold">
                    {hotel.city}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
                    {hotel.name}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-ink">
                    {hotel.why}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-gutter py-12">
          <div className="rounded-lg border-l-4 border-gold bg-surface p-6">
            <h2 className="font-heading text-2xl font-bold text-ink">
              Important caveat
            </h2>
            <p className="mt-3 text-lg leading-8 text-ink">
              {travelPackage.caveat}
            </p>
          </div>
        </section>

        <section className="bg-surface text-ink">
          <div className="site-gutter py-14">
            <p className="font-heading text-sm font-bold uppercase text-gold">
              Ready to shape it around you?
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-4xl font-bold">
              Turn {travelPackage.name} into your private Colombia plan
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink">
              We will tune pace, hotels, guiding style, and add-on moments
              before anything is confirmed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/plan?package=${travelPackage.slug}`}
                className="btn-primary"
              >
                Customise this trip
              </Link>
              <Link
                href="/packages"
                className="btn-secondary"
              >
                Compare packages
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
