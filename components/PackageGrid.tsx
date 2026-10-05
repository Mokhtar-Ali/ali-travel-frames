import Image from "next/image";
import Link from "next/link";
import { PackageEmptyState } from "@/components/PackageEmptyState";
import type { Package } from "@/content/types";
import { formatUsd } from "@/lib/format";

export function PackageGrid({ packages }: { packages: Package[] }) {
  if (packages.length === 0) {
    return <PackageEmptyState />;
  }

  return (
    <div className="country-package-grid">
      {packages.map((travelPackage) => (
        <Link
          key={travelPackage.slug}
          href={`/packages/${travelPackage.slug}`}
          className="country-package-card"
        >
          <div className="country-package-image">
            <Image
              src={travelPackage.heroImage}
              alt={`${travelPackage.name} trip scene`}
              width={760}
              height={950}
              loading="lazy"
              sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
              className="media-scale h-full w-full object-cover"
            />
          </div>
          <div className="country-package-copy">
            <p className="eyebrow">
              {travelPackage.nights} nights / {travelPackage.cities.join(", ")}
            </p>
            <h3>{travelPackage.name}</h3>
            <p className="package-card-teaser">{travelPackage.teaser}</p>
            <p className="package-card-price">
              From {formatUsd(travelPackage.priceFrom)} per person
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
