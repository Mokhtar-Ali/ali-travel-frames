"use client";

import { type FormEvent, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";

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
          ? "Done. The Colombia guide is on its way."
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
    <Reveal id="guide" className="home-section bg-ink text-white">
      <div className="section-inner text-center">
        <p className="eyebrow text-white/[.58]">The guide</p>
        <h2 className="section-title mx-auto mt-4 max-w-[620px] text-white">
          A quieter first step into Colombia
        </h2>
        <p className="mx-auto mt-5 max-w-[620px] text-white/[.72]">
          Get the short field guide we use to help travelers think through
          routes, timing, and what to skip.
        </p>
        {isSuccess ? (
          <p className="mt-8 text-white/[.82]" aria-live="polite">
            {message}
          </p>
        ) : (
          <form className="guide-form mx-auto max-w-[620px]" onSubmit={handleSubmit}>
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
        )}
        {!isSuccess && message ? (
          <p className="mt-4 small-text text-white/[.72]" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
