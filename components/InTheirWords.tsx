import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { reviews } from "@/lib/reviews";

const review = reviews.find((item) => item.name === "Harryele Eugene") ?? reviews[0];

export function InTheirWords() {
  return (
    <Reveal className="home-section bg-sand">
      <div className="section-inner text-center">
        <p className="eyebrow">In their words</p>
        <blockquote className="testimonial-quote mt-8">
          &ldquo;I discovered Ali on YouTube, and I&apos;m so glad I trusted my
          instincts. This was the best-planned trip I&apos;ve ever
          experienced.&rdquo;
        </blockquote>
        <div className="mt-8 grid justify-items-center">
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
        <ButtonLink href="/reviews" variant="quiet" className="mt-10">
          Read more from travellers
        </ButtonLink>
      </div>
    </Reveal>
  );
}
