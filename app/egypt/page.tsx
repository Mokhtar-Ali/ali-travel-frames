import type { Metadata } from "next";
import Image from "next/image";
import { Invitation } from "@/components/Invitation";
import { ButtonLink } from "@/components/ui/Button";
import { reviews } from "@/lib/reviews";
import { buildMetadata } from "@/lib/seo";

const experiences = [
  {
    name: "Cairo & Giza",
    image: "/egypt/cairo.jpg",
    description:
      "The pyramids, the Egyptian Museum, and the living city around them all need room to breathe.",
  },
  {
    name: "Luxor & Aswan",
    image: "/egypt/luxor.jpg",
    description:
      "Temples, tombs, and Upper Egypt work best at a pace that leaves time for the river.",
  },
  {
    name: "A Nile cruise",
    image: "/egypt/nile.jpg",
    description:
      "A slower way between the ancient sites, with the landscape doing half the work.",
  },
  {
    name: "The Red Sea",
    image: "/egypt/red-sea.jpg",
    description:
      "Clear water and unhurried days make a useful counterweight to the monuments.",
  },
];

const jorgeReview = reviews.find(
  (review) => review.name === "Jorge Rodriguez",
);

export const metadata: Metadata = buildMetadata({
  title: "Private Egypt Travel Planning",
  description:
    "Private Egypt trips planned first-hand, from Cairo and the Nile to the Red Sea.",
  path: "/egypt",
  image: "/egypt/hero.jpg",
  imageAlt: "Egypt",
});

export default function EgyptPage() {
  if (!jorgeReview) {
    throw new Error("The Egypt testimonial is missing.");
  }

  return (
    <div className="bg-paper">
      <section className="egypt-hero">
        {/* TODO: Add the Egypt hero image at /public/egypt/hero.jpg. */}
        <Image
          src="/egypt/hero.jpg"
          alt="Egypt"
          width={2400}
          height={1500}
          sizes="100vw"
          priority
          className="egypt-hero-image"
        />
        <div className="hero-scrim" />
        <div className="section-inner egypt-hero-content">
          <h1 className="display-title hero-title">
            Egypt, the second country I know properly
          </h1>
          <p className="hero-subtitle">
            Private routes shaped with first-hand judgment and people I trust.
          </p>
          <ButtonLink href="/plan?c=egypt" className="mt-8">
            Plan an Egypt trip
          </ButtonLink>
        </div>
      </section>

      <section className="page-section bg-paper">
        <div className="section-inner">
          <div className="egypt-statement">
            <p className="eyebrow">Why Egypt</p>
            <h2 className="section-title mt-4">
              The only other country on this site
            </h2>
            <p className="mt-6">
              Egypt is here for the same reason Colombia is: I know it through
              time spent on the ground, people I trust, and the practical
              details that decide whether a trip feels considered or merely
              booked. I would rather know two countries properly than sell a
              long list at arm&apos;s length.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section bg-sand">
        <div className="section-inner">
          <p className="eyebrow">Four ways into Egypt</p>
          <h2 className="section-title mt-4">Where the trip can take shape</h2>
          {/* TODO: Add cairo.jpg, luxor.jpg, nile.jpg, and red-sea.jpg under /public/egypt/. */}
          <div className="egypt-experience-grid mt-10">
            {experiences.map((experience) => (
              <article key={experience.name} className="egypt-experience">
                <div className="egypt-experience-image">
                  <Image
                    src={experience.image}
                    alt={experience.name}
                    width={1200}
                    height={800}
                    loading="lazy"
                    sizes="(max-width: 680px) 100vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="egypt-experience-copy">
                  <h3>{experience.name}</h3>
                  <p className="mt-3">{experience.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section bg-paper">
        <div className="section-inner text-center">
          <p className="eyebrow">In their words</p>
          <blockquote className="egypt-testimonial mt-10">
            <p className="testimonial-quote">
              &ldquo;{jorgeReview.text}&rdquo;
            </p>
            <div className="mt-8 grid justify-items-center">
              <Image
                src={jorgeReview.avatar}
                alt={jorgeReview.name}
                width={56}
                height={56}
                loading="lazy"
                className="avatar-round h-14 w-14 object-cover"
              />
              <p className="mt-4 text-[15px] font-medium leading-none text-ink">
                {jorgeReview.name}
              </p>
              <p className="mt-2 small-text text-muted">
                {jorgeReview.trip}
              </p>
            </div>
          </blockquote>
        </div>
      </section>

      <Invitation country="Egypt" href="/plan?c=egypt" />
    </div>
  );
}
