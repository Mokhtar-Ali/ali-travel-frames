import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import {
  getAllPackageSlugs,
  getPackageBySlug,
  type TravelPackage,
} from "@/content/packages";
import { formatUsd } from "@/lib/format";
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
    image: travelPackage.heroImage.src,
    imageAlt: travelPackage.heroImage.alt,
  });
}

function buildTouristTripJsonLd(travelPackage: TravelPackage) {
  const packageUrl = `${SITE_URL}/packages/${travelPackage.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: travelPackage.name,
    description: travelPackage.summary,
    image: `${SITE_URL}${travelPackage.heroImage.src}`,
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
      locationCreated: {
        "@type": "Place",
        name: day.city,
      },
      description: day.description,
    })),
    offers: {
      "@type": "Offer",
      price: travelPackage.pricePerPersonUsd,
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

  const touristTripJsonLd = buildTouristTripJsonLd(travelPackage);

  return (
    <>
      <JsonLd
        id={`${travelPackage.slug}-tourist-trip-json-ld`}
        data={touristTripJsonLd}
      />
      <article>
        <section className="relative isolate min-h-[620px] overflow-hidden bg-[#17382f] text-white">
          <Image
            src={travelPackage.heroImage.src}
            alt={travelPackage.heroImage.alt}
            width={travelPackage.heroImage.width}
            height={travelPackage.heroImage.height}
            sizes="100vw"
            priority
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[#17382f]/65" />
          <div className="mx-auto flex min-h-[620px] max-w-7xl flex-col justify-end px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="font-heading text-sm font-bold uppercase text-[#f2c16b]">
              {travelPackage.nights} nights
            </p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.02] sm:text-7xl">
              {travelPackage.name}
            </h1>
            <p className="mt-5 font-heading text-2xl font-bold">
              From {formatUsd(travelPackage.pricePerPersonUsd)} per person
            </p>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-stone-100">
              {travelPackage.shortSummary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/plan"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#f2c16b] px-5 py-3 font-heading text-sm font-bold text-[#17382f] transition hover:bg-white"
              >
                Book a free 15-minute call
              </Link>
              <Link
                href={`/plan?package=${travelPackage.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-[#17382f]"
              >
                Customise this trip
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
              Summary
            </p>
            <p className="text-2xl leading-10 text-stone-800">
              {travelPackage.summary}
            </p>
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-heading text-sm font-bold uppercase text-[#2f628f]">
                Day by day
              </p>
              <h2 className="mt-2 font-heading text-4xl font-bold text-[#1f3d35]">
                Itinerary
              </h2>
            </div>
            <ol className="mt-9 grid gap-5">
              {travelPackage.itinerary.map((day) => (
                <li
                  key={day.day}
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbfaf7] p-5 sm:grid-cols-[6rem_1fr]"
                >
                  <div className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
                    Day {day.day}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[#1f3d35]">
                      {day.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-stone-600">
                      {day.city}
                    </p>
                    <p className="mt-3 text-base leading-7 text-stone-700">
                      {day.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <h2 className="font-heading text-3xl font-bold text-[#1f3d35]">
                What&apos;s included
              </h2>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-stone-700">
                {travelPackage.included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f5f4a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <h2 className="font-heading text-3xl font-bold text-[#1f3d35]">
                Not included
              </h2>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-stone-700">
                {travelPackage.notIncluded.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#b35b3b]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-stone-200 bg-[#f2eadc]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
                Hotels
              </p>
              <h2 className="mt-2 font-heading text-4xl font-bold text-[#1f3d35]">
                Named hotel shortlist
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {travelPackage.hotels.map((hotel) => (
                <section
                  key={`${hotel.city}-${hotel.name}`}
                  className="rounded-lg border border-stone-200 bg-white p-5"
                >
                  <p className="font-heading text-sm font-bold uppercase text-[#2f628f]">
                    {hotel.city}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-[#1f3d35]">
                    {hotel.name}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-stone-700">
                    {hotel.why}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border-l-4 border-[#b35b3b] bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-[#1f3d35]">
              Important caveat
            </h2>
            <p className="mt-3 text-lg leading-8 text-stone-700">
              {travelPackage.caveat}
            </p>
          </div>
        </section>

        <section className="bg-[#17382f]">
          <div className="mx-auto max-w-7xl px-4 py-14 text-white sm:px-6 lg:px-8">
            <p className="font-heading text-sm font-bold uppercase text-[#f2c16b]">
              Ready to shape it around you?
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-4xl font-bold">
              Turn {travelPackage.name} into your private Colombia plan
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100">
              We will tune pace, hotels, guiding style, and add-on moments
              before anything is confirmed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/plan?package=${travelPackage.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#f2c16b] px-5 py-3 font-heading text-sm font-bold text-[#17382f] transition hover:bg-white"
              >
                Customise this trip
              </Link>
              <Link
                href="/packages"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-[#17382f]"
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
