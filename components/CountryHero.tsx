import Image from "next/image";

type CountryHeroProps = {
  title: string;
  subtitle: string;
  image: string;
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
      <Image
        src={image}
        alt={imageAlt}
        width={2400}
        height={1500}
        sizes="100vw"
        priority
        className="country-hero-image"
      />
      <div className="hero-scrim" />
      <div className="section-inner country-hero-content">
        <h1 className="display-title hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
