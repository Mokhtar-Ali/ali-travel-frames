import Image from "next/image";
import { reviews } from "@/lib/reviews";

type ReviewCountry = "Colombia" | "Egypt";

const colombiaReviewNames = new Set([
  "Marwa Rezq",
  "Harryele Eugene",
  "Adam",
  "Josh Wallace",
  "Juan Valencia",
]);

function getCountryReviews(country: ReviewCountry) {
  return reviews.filter((review) =>
    country === "Egypt"
      ? review.name === "Jorge Rodriguez"
      : colombiaReviewNames.has(review.name),
  );
}

export function CountryReviews({ country }: { country: ReviewCountry }) {
  const countryReviews = getCountryReviews(country);

  return (
    <section className="home-section bg-sand">
      <div className="section-inner">
        <p className="eyebrow">In their words</p>
        <h2 className="section-title mt-4">Reviews from {country}</h2>
        <div className="country-reviews-grid mt-10">
          {countryReviews.map((review) => (
            <blockquote key={review.name} className="country-review">
              <p>&ldquo;{review.text}&rdquo;</p>
              <div className="country-review-person">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="avatar-round h-12 w-12 object-cover"
                />
                <div>
                  <p className="country-review-name">{review.name}</p>
                  <p className="small-text text-muted">{review.trip}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
