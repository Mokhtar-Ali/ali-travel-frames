"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";

const guideImages = [
  { city: "Cartagena", src: "/guide/cartagena.jpg" },
  { city: "Medellín", src: "/guide/medellin.jpg" },
  { city: "Santa Marta", src: "/guide/santa-marta.jpg" },
];

const guideItems = [
  "How many nights each city actually needs",
  "Where to stay in Cartagena, Medellín and Santa Marta",
  "Honest safety guidance, by neighbourhood",
  "What to skip — and what it costs",
];

export function Guide() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { ok?: boolean };

      setMessage(
        response.ok && result.ok
          ? "Done. The Colombia field guide is on its way."
          : "Please enter a valid email.",
      );
    } catch {
      setMessage("Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSuccess = message.startsWith("Done.");

  return (
    <Reveal id="guide" className="home-section guide-section">
      <div className="section-inner guide-grid">
        <div className="guide-image-row" aria-label="Colombia guide previews">
          {guideImages.map((image) => (
            <figure key={image.city}>
              <div className="media-frame guide-image">
                <Image
                  src={image.src}
                  alt={`${image.city} Colombia`}
                  width={480}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 899px) 28vw, 15vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption>{image.city}</figcaption>
            </figure>
          ))}
        </div>

        <div>
          <p className="guide-eyebrow">Free guide</p>
          <h2 className="section-title guide-title mt-4">
            The Colombia field guide
          </h2>
          <p className="guide-copy mt-5">
            A short, practical PDF for shaping a Colombia trip before you book.
          </p>
          <ul className="guide-list mt-8">
            {guideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {isSuccess ? (
            <p className="guide-status mt-8" aria-live="polite">
              {message}
            </p>
          ) : (
            <>
              <form className="guide-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="guide-email">
                  Email
                </label>
                <input
                  id="guide-email"
                  className="guide-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending" : "Send it"}
                </Button>
              </form>
              <p className="guide-note">One email, one PDF. No sequence.</p>
              {message ? (
                <p className="guide-status mt-4" aria-live="polite">
                  {message}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Reveal>
  );
}
