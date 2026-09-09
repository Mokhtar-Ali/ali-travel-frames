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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <Link
        href={`/packages/${travelPackage.slug}`}
        className="block overflow-hidden bg-stone-100"
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
          <p className="font-heading text-sm font-bold uppercase text-[#b35b3b]">
            {travelPackage.nights} nights
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-[#1f3d35]">
            <Link
              href={`/packages/${travelPackage.slug}`}
              className="transition hover:text-[#b35b3b]"
            >
              {travelPackage.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm font-semibold text-stone-600">
            {travelPackage.cities.join(", ")}
          </p>
        </div>
        <p className="font-heading text-lg font-bold text-stone-950">
          From {formatUsd(travelPackage.priceFrom)} per person
        </p>
        <p className="text-base leading-7 text-stone-700">
          {travelPackage.summary}
        </p>
        <Link
          href={`/packages/${travelPackage.slug}`}
          className="mt-auto inline-flex w-fit items-center rounded-md border border-[#1f5f4a] px-4 py-2 font-heading text-sm font-bold text-[#1f5f4a] transition hover:bg-[#1f5f4a] hover:text-white"
        >
          View package
        </Link>
      </div>
    </article>
  );
}
