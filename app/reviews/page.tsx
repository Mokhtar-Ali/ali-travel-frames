import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { reviews } from "@/lib/reviews";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Traveller Reviews",
    description:
      "Read Ali Travel Frames traveller reviews from private Colombia trips and custom planning clients.",
    path: "/reviews",
  });
}

export default function ReviewsPage() {
  return (
    <Reveal className="page-section bg-paper">
      <div className="section-inner">
        <p className="eyebrow">Reviews</p>
        <h1 className="display-title mt-5 max-w-[12ch]">
          Quiet proof from real travellers
        </h1>
        <div className="mt-24 grid gap-20">
          {reviews.map((review, index) => (
            <article
              key={review.name}
              className={index === 0 ? "" : "border-t border-line pt-20"}
            >
              <div className="grid gap-8 md:grid-cols-[220px_1fr]">
                <div>
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={44}
                    height={44}
                    loading="lazy"
                    className="avatar-round h-11 w-11 object-cover"
                  />
                  <p className="mt-4 text-[15px] font-medium leading-none text-ink">
                    {review.name}
                  </p>
                  <p className="mt-2 small-text text-muted">{review.trip}</p>
                </div>
                <blockquote className="max-w-[62ch] text-xl leading-[1.75] text-ink">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
