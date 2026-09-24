import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import {
  aboutEgypt,
  aboutParagraphs,
  aboutTripMeaning,
  youtubeChannelUrl,
} from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The American who lives there",
  description:
    "Meet Ali, the American travel planner behind private trips in Colombia and Egypt.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="page-section bg-paper text-ink">
      <div className="section-inner">
        <div className="about-page">
          <p className="eyebrow">Ali Travel Frames</p>
          <h1 className="display-title mt-5">The American who lives there</h1>
          <div className="about-image mt-10">
            <Image
              src="/brand/ali.jpg"
              alt="Ali, founder of Ali Travel Frames"
              width={1320}
              height={880}
              sizes="(max-width: 760px) 100vw, 660px"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="about-copy mt-10">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              <strong>{aboutEgypt.lead}</strong> {aboutEgypt.body}
            </p>
          </div>

          <h2 className="section-title mt-14">
            What that means for your trip
          </h2>
          <div className="about-meaning mt-7">
            {aboutTripMeaning.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="about-actions mt-10">
            <ButtonLink href="/plan">Plan a trip</ButtonLink>
            <ButtonLink href={youtubeChannelUrl} variant="quiet">
              Watch the channel
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
