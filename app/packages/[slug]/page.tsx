import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import {
  getAllPackageSlugs,
  getPackageBySlug,
} from "@/content/packages/index";
import { formatUsd } from "@/lib/format";
import { publicAssetExists } from "@/lib/public-assets";
import { buildMetadata } from "@/lib/seo";

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

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const travelPackage = getPackageBySlug(slug);

  if (!travelPackage) {
    notFound();
  }

  const hasHeroImage = publicAssetExists(travelPackage.heroImage);

  return (
    <article className="bg-paper">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-paper">
        {hasHeroImage ? (
          <>
            <Image
              src={travelPackage.heroImage}
              alt={`${travelPackage.name} trip scene`}
              width={1800}
              height={1125}
              sizes="100vw"
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div className="hero-scrim" />
          </>
        ) : null}
        <div className="section-inner flex min-h-[620px] flex-col justify-end py-16 text-white">
          <p className={`eyebrow ${hasHeroImage ? "text-white/[.7]" : ""}`}>
            {travelPackage.nights} nights
          </p>
          <h1
            className={`display-title mt-5 max-w-[13ch] ${
              hasHeroImage ? "text-white" : "text-ink"
            }`}
          >
            {travelPackage.name}
          </h1>
          <p
            className={`mt-6 text-[20px] font-medium leading-[1.5] ${
              hasHeroImage ? "text-white/[.86]" : "text-ink"
            }`}
          >
            From {formatUsd(travelPackage.priceFrom)} per person
          </p>
          <p
            className={`mt-5 max-w-[52ch] ${
              hasHeroImage ? "text-white/[.82]" : "text-ink-2"
            }`}
          >
            {travelPackage.summary}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/plan">Book a free 15-minute call</ButtonLink>
            <ButtonLink
              href={`/plan?package=${travelPackage.slug}`}
              variant={hasHeroImage ? "onImage" : "quiet"}
            >
              Customise this trip
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-inner grid gap-12 lg:grid-cols-[.34fr_1fr]">
          <p className="eyebrow">Summary</p>
          <p className="max-w-[58ch] text-[20px] leading-[1.8] text-ink">
            {travelPackage.summary}
          </p>
        </div>
      </section>

      <section className="page-section border-y border-line bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Day by day</p>
          <h2 className="section-title mt-4">Itinerary</h2>
          <ol className="mt-16 grid gap-12">
            {travelPackage.itinerary.map((day) => (
              <li key={day.day} className="grid gap-6 md:grid-cols-[120px_1fr]">
                <p className="eyebrow">Day {day.day}</p>
                <div className="border-t border-line pt-6">
                  <h3>{day.title}</h3>
                  <p className="mt-4 max-w-[68ch]">{day.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section">
        <div className="section-inner grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="section-title">What&apos;s included</h2>
            <ul className="mt-10 grid gap-4">
              {travelPackage.included.map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-emerald" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="section-title">Not included</h2>
            <ul className="mt-10 grid gap-4">
              {travelPackage.excluded.map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section border-y border-line bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Hotels</p>
          <h2 className="section-title mt-4">Named hotel shortlist</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {travelPackage.hotels.map((hotel) => (
              <article
                key={`${hotel.city}-${hotel.name}`}
                className="border-t border-line pt-6"
              >
                <p className="eyebrow">{hotel.city}</p>
                <h3 className="mt-4">{hotel.name}</h3>
                <p className="mt-4">{hotel.why}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-inner">
          <div className="panel-frame border-l border-line bg-sand p-8">
            <h2 className="section-title">Important caveat</h2>
            <p className="mt-6 max-w-[68ch]">{travelPackage.caveat}</p>
          </div>
        </div>
      </section>

      <section className="page-section border-t border-line">
        <div className="section-inner text-center">
          <p className="eyebrow">Ready to shape it around you?</p>
          <h2 className="section-title mx-auto mt-4 max-w-[16ch]">
            Turn {travelPackage.name} into your private Colombia plan
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch]">
            We will tune pace, hotels, guiding style, and add-on moments before
            anything is confirmed.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={`/plan?package=${travelPackage.slug}`}>
              Customise this trip
            </ButtonLink>
            <ButtonLink href="/packages" variant="quiet">
              Compare journeys
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
