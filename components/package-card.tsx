import Image from "next/image";
import Link from "next/link";
import type { Package } from "@/content/packages";
import { formatUsd } from "@/lib/format";

type PackageCardProps = {
  travelPackage: Package;
  priority?: boolean;
};

export function PackageCard({
  travelPackage,
  priority = false,
}: PackageCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-hair bg-surface">
      <Link
        href={`/packages/${travelPackage.slug}`}
        className="block overflow-hidden bg-gold-soft"
        aria-label={`View ${travelPackage.name}`}
      >
        <Image
          src={travelPackage.heroImage}
          alt={`${travelPackage.name} trip scene`}
          width={1600}
          height={1000}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="aspect-[16/10] h-auto w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="font-heading text-sm font-bold uppercase text-gold">
            {travelPackage.nights} nights
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
            <Link
              href={`/packages/${travelPackage.slug}`}
              className="transition hover:text-ink-2"
            >
              {travelPackage.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm font-semibold text-ink-2">
            {travelPackage.cities.join(", ")}
          </p>
        </div>
        <p className="font-heading text-lg font-bold text-ink">
          From {formatUsd(travelPackage.priceFrom)} per person
        </p>
        <p className="text-base leading-7 text-ink">
          {travelPackage.summary}
        </p>
        <Link
          href={`/packages/${travelPackage.slug}`}
          className="btn-secondary mt-auto w-fit"
        >
          View package
        </Link>
      </div>
    </article>
  );
}
