"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { hero, trustStrip } from "@/content/site";

const slides = [
  { place: "Cartagena", country: "Colombia", image: "/hero/01-cartagena.jpg" },
  { place: "Rosario Islands", country: "Colombia", image: "/hero/02-rosario.jpg" },
  { place: "Medellín", country: "Colombia", image: "/hero/03-medellin.jpg" },
  { place: "Guatapé", country: "Colombia", image: "/hero/04-guatape.jpg" },
  { place: "Santa Fe de Antioquia", country: "Colombia", image: "/hero/05-santa-fe.jpg" },
  { place: "Santa Marta", country: "Colombia", image: "/hero/06-santa-marta.jpg" },
  // TODO: Add the four Egypt hero images under /public/egypt/.
  { place: "Cairo", country: "Egypt", image: "/egypt/hero-1.jpg" },
  { place: "Giza", country: "Egypt", image: "/egypt/hero-2.jpg" },
  { place: "Luxor", country: "Egypt", image: "/egypt/hero-3.jpg" },
  { place: "Aswan", country: "Egypt", image: "/egypt/hero-4.jpg" },
];

const mediaQuery = "(prefers-reduced-motion: reduce)";
const crossfadeDurationMs = 450;

type HeroSlide = (typeof slides)[number];
type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};
type WindowWithIdle = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function subscribeToReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(mediaQuery);

  query.addEventListener("change", onStoreChange);

  return () => {
    query.removeEventListener("change", onStoreChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia(mediaQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot,
  );
}

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const frameRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const currentIndex = prefersReducedMotion ? 0 : activeIndex;
  const currentSlide = slides[currentIndex];
  const previousSlide = slides[previousIndex];
  const isPaused =
    prefersReducedMotion || isPointerOver || isFocusInside || isTabHidden;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const updateVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const advanceSlide = useCallback(() => {
    const nextIndex = (activeIndexRef.current + 1) % slides.length;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    setPreviousIndex(activeIndexRef.current);
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    setIsTransitioning(false);

    frameRef.current = window.requestAnimationFrame(() => {
      setIsTransitioning(true);
      frameRef.current = null;

      transitionTimerRef.current = window.setTimeout(() => {
        setPreviousIndex(nextIndex);
        transitionTimerRef.current = null;
      }, crossfadeDurationMs);
    });
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(advanceSlide, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [advanceSlide, isPaused]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const navigatorWithConnection = navigator as NavigatorWithConnection;

    if (navigatorWithConnection.connection?.saveData) {
      return;
    }

    const idleWindow = window as WindowWithIdle;

    if (!idleWindow.requestIdleCallback || !idleWindow.cancelIdleCallback) {
      return;
    }

    const nextSlide = slides[(activeIndex + 1) % slides.length];
    const idleId = idleWindow.requestIdleCallback(() => {
      const image = new window.Image();
      image.src = nextSlide.image;
    });

    return () => {
      idleWindow.cancelIdleCallback?.(idleId);
    };
  }, [activeIndex, prefersReducedMotion]);

  return (
    <>
      <section
        className="home-hero"
        onBlurCapture={(event) => {
          const relatedTarget =
            event.relatedTarget instanceof Node ? event.relatedTarget : null;

          if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
            setIsFocusInside(false);
          }
        }}
        onFocusCapture={() => setIsFocusInside(true)}
        onPointerEnter={() => setIsPointerOver(true)}
        onPointerLeave={() => setIsPointerOver(false)}
      >
        {prefersReducedMotion || previousIndex === activeIndex ? null : (
          <HeroImage
            key={`previous-${previousSlide.image}`}
            slide={previousSlide}
            alt=""
            className={`hero-slide ${isTransitioning ? "" : "hero-slide-active"}`}
            isFirstSlide={previousIndex === 0}
            aria-hidden
          />
        )}
        <HeroImage
          key={`active-${currentSlide.image}`}
          slide={currentSlide}
          alt={`${currentSlide.place}, ${currentSlide.country}`}
          className={`hero-slide ${
            isTransitioning || previousIndex === activeIndex
              ? "hero-slide-active"
              : ""
          }`}
          isFirstSlide={currentIndex === 0}
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <h1 className="display-title hero-title">{hero.h1}</h1>
          <p className="hero-subtitle">{hero.sub}</p>
          <div className="hero-actions">
            <ButtonLink href="/plan">Book a call</ButtonLink>
            <ButtonLink href="/colombia" variant="ghostGlass">
              Explore Colombia
            </ButtonLink>
          </div>
        </div>
        <p className="hero-city-indicator">
          {currentSlide.place}, {currentSlide.country}
        </p>
      </section>
      <div className="trust-strip">
        <div className="section-inner trust-strip-inner">
          {trustStrip.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </>
  );
}

function HeroImage({
  slide,
  alt,
  className,
  isFirstSlide,
  "aria-hidden": ariaHidden,
}: {
  slide: HeroSlide;
  alt: string;
  className: string;
  isFirstSlide: boolean;
  "aria-hidden"?: boolean;
}) {
  return (
    <Image
      src={slide.image}
      alt={alt}
      width={2400}
      height={1500}
      sizes="100vw"
      priority={isFirstSlide}
      loading={isFirstSlide ? undefined : "lazy"}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
