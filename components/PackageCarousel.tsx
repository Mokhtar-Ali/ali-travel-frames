"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PackageEmptyState } from "@/components/PackageEmptyState";
import type { Package } from "@/content/types";
import { formatUsd } from "@/lib/format";

export type CarouselPackage = Pick<
  Package,
  "slug" | "name" | "nights" | "cities" | "teaser" | "priceFrom" | "heroImage"
>;

type PackageCarouselProps = {
  country: Package["country"];
  packages: CarouselPackage[];
};

export function PackageCarousel({
  country,
  packages,
}: PackageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const countryLabel = country === "egypt" ? "Egypt" : "Colombia";

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    setCanScrollBack(track.scrollLeft > 1);
    setCanScrollForward(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>(
      ".package-carousel-card",
    );
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const cardStep = firstCard ? firstCard.offsetWidth + gap : track.clientWidth;
    const visibleCards = Math.max(
      1,
      Math.floor((track.clientWidth + gap) / cardStep),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * cardStep * visibleCards,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (packages.length === 0) {
    return <PackageEmptyState />;
  }

  return (
    <div className="package-carousel">
      <div
        className="package-carousel-controls"
        role="group"
        aria-label={`${countryLabel} carousel controls`}
      >
        <button
          type="button"
          aria-label={`Previous ${countryLabel} journeys`}
          aria-controls={`package-carousel-${country}`}
          disabled={!canScrollBack}
          onClick={() => scroll(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label={`Next ${countryLabel} journeys`}
          aria-controls={`package-carousel-${country}`}
          disabled={!canScrollForward}
          onClick={() => scroll(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="package-carousel-viewport">
        <div
          ref={trackRef}
          id={`package-carousel-${country}`}
          className="package-carousel-track"
          aria-label={`${countryLabel} journeys`}
          tabIndex={0}
        >
          {packages.map((travelPackage) => (
            <Link
              key={travelPackage.slug}
              href={`/packages/${travelPackage.slug}`}
              className="package-carousel-card"
            >
              <div className="package-carousel-image">
                <Image
                  src={travelPackage.heroImage}
                  alt={`${travelPackage.name} trip scene`}
                  width={760}
                  height={950}
                  loading="lazy"
                  sizes="(max-width: 680px) calc(100vw - 84px), (max-width: 1000px) 50vw, 33vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="package-carousel-copy">
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
      </div>
    </div>
  );
}
