"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { reviews } from "@/lib/reviews";

const mediaQuery = "(prefers-reduced-motion: reduce)";
const colombiaReviewNames = new Set([
  "Marwa Rezk",
  "Harryele Eugene",
  "Adam",
  "Josh Wallace",
  "Juan Valencia",
]);

const carouselReviews = reviews
  .filter((review) => colombiaReviewNames.has(review.name))
  .map((review) => ({
    ...review,
    text: trimToSentences(review.text, 2),
  }));

function trimToSentences(text: string, sentenceCount: number) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);

  if (!sentences) {
    return text;
  }

  return sentences.slice(0, sentenceCount).join(" ").replace(/\s+/g, " ").trim();
}

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

export function InTheirWords() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isPaused =
    prefersReducedMotion || isPointerOver || isFocusInside || isTabHidden;

  useEffect(() => {
    const updateVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % carouselReviews.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused]);

  return (
    <Reveal className="home-section bg-sand">
      <div
        className="section-inner text-center"
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
        <p className="eyebrow">In their words</p>
        <h2 className="section-title mx-auto mt-4 max-w-[12ch]">
          Notes from Colombia
        </h2>
        <div className="reviews-carousel mt-10">
          <div className="reviews-carousel-frame">
            {carouselReviews.map((review, index) => (
              <blockquote
                key={review.name}
                className="reviews-carousel-panel"
                aria-hidden={activeIndex !== index}
                data-active={activeIndex === index}
              >
                <p className="testimonial-quote">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-8 grid justify-items-center">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="avatar-round h-14 w-14 object-cover"
                  />
                  <p className="mt-4 text-[15px] font-medium leading-none text-ink">
                    {review.name}
                  </p>
                  <p className="mt-2 small-text text-muted">{review.trip}</p>
                </div>
              </blockquote>
            ))}
          </div>
          <div className="review-indicators" aria-label="Choose a review">
            {carouselReviews.map((review, index) => (
              <button
                key={review.name}
                className="review-indicator"
                type="button"
                aria-label={`Show ${review.name}'s review`}
                aria-current={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
        <ButtonLink href="/reviews" variant="quiet" className="mt-10">
          Read more from travellers
        </ButtonLink>
      </div>
    </Reveal>
  );
}
