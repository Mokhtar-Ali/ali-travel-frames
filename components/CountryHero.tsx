import { ImageWithFallback } from "@/components/ImageWithFallback";
import { publicAssetExists } from "@/lib/public-assets";

type CountryHeroProps = {
  title: string;
  subtitle: string;
  image?: string;
  imageAlt: string;
};

export function CountryHero({
  title,
  subtitle,
  image,
  imageAlt,
}: CountryHeroProps) {
  return (
    <section className="country-hero">
      <ImageWithFallback
        src={publicAssetExists(image) ? image : undefined}
        alt={imageAlt}
        width={2400}
        height={1500}
        sizes="100vw"
        preload
        frameClassName="country-hero-image"
        className="h-full w-full object-cover"
      />
      <div className="hero-scrim" />
      <div className="section-inner country-hero-content">
        <h1 className="display-title hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
