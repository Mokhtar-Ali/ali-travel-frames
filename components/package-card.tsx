import Image from "next/image";
import Link from "next/link";
import type { Package } from "@/content/packages/index";
import { formatUsd } from "@/lib/format";

type PackageCardProps = {
  travelPackage: Package;
};

export function PackageCard({ travelPackage }: PackageCardProps) {
  return (
    <article className="border-t border-line pt-8">
      <Link
        href={`/packages/${travelPackage.slug}`}
        className="group grid gap-6 text-inherit no-underline md:grid-cols-[240px_1fr]"
      >
        <div className="media-frame aspect-[4/5] bg-sand">
          <Image
            src={`/packages/${travelPackage.slug}/hero.jpg`}
            alt={`${travelPackage.name} in Colombia`}
            width={600}
            height={750}
            loading="lazy"
            sizes="(max-width: 767px) 100vw, 240px"
            className="media-scale h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">
            {travelPackage.nights} nights / {travelPackage.cities.join(", ")}
          </p>
          <h3 className="mt-4">{travelPackage.name}</h3>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-ink-2">
            {travelPackage.summary}
          </p>
          <p className="mt-5 text-[15px] font-medium leading-[1.6] text-ink">
            From {formatUsd(travelPackage.priceFrom)} per person
          </p>
        </div>
      </Link>
    </article>
  );
}
