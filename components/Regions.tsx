import Image from "next/image";
import Link from "next/link";
import { colombiaPackages } from "@/content/packages";

const regions = [
  {
    name: "Cartagena",
    slug: "cartagena",
    image: "/hero/01-cartagena.jpg",
    chip: "Walled city · Islands",
    cityMatches: ["Cartagena", "Rosario Islands"],
  },
  {
    name: "Medellín",
    slug: "medellin",
    image: "/hero/03-medellin.jpg",
    chip: "City · Guatapé",
    cityMatches: ["Medellín", "Guatapé"],
  },
  {
    name: "Coffee Region",
    slug: "coffee-region",
    image: "/destinations/coffee-region.jpg",
    chip: "Farms · Waterfalls",
    cityMatches: ["Salento", "Filandia", "Cocora Valley", "Pereira"],
  },
  {
    name: "Santa Marta",
    slug: "santa-marta",
    image: "/destinations/santa-marta.jpg",
    chip: "Tayrona · Minca",
    cityMatches: ["Santa Marta", "Minca", "Tayrona", "Palomino", "La Guajira"],
  },
  {
    name: "San Andrés",
    slug: "san-andres",
    image: "/destinations/san-andres.jpg",
    chip: "Reefs · Beaches",
    cityMatches: ["San Andrés", "Providencia"],
  },
];

function countJourneysForRegion(cityMatches: string[]) {
  return colombiaPackages.filter((travelPackage) =>
    travelPackage.cities.some((city) => cityMatches.includes(city)),
  ).length;
}

export function Regions() {
  return (
    <div className="regions-grid mt-10">
      {regions.map((region) => {
        const journeyCount = countJourneysForRegion(region.cityMatches);

        return (
          <Link
            key={region.slug}
            href={`/colombia?region=${region.slug}`}
            className="region-card group"
          >
            <Image
              src={region.image}
              alt={`${region.name} Colombia`}
              width={600}
              height={800}
              loading="lazy"
              sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, (max-width: 1100px) 33vw, 20vw"
              className="media-scale h-full w-full object-cover"
            />
            <div className="region-scrim" />
            <div className="region-content">
              <p className="region-chip">{region.chip}</p>
              <h3 className="region-title">{region.name}</h3>
              <p className="region-count">
                {journeyCount} {journeyCount === 1 ? "journey" : "journeys"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
