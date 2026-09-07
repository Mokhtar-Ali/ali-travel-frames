export type PackageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PackageDay = {
  day: number;
  title: string;
  city: string;
  description: string;
};

export type PackageHotel = {
  name: string;
  city: string;
  why: string;
};

export type TravelPackage = {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  featured: boolean;
  nights: number;
  cities: string[];
  pricePerPersonUsd: number;
  shortSummary: string;
  summary: string;
  heroImage: PackageImage;
  itinerary: PackageDay[];
  included: string[];
  notIncluded: string[];
  hotels: PackageHotel[];
  caveat: string;
};

const packages: TravelPackage[] = [
  {
    slug: "classic-colombia",
    name: "Classic Colombia",
    title: "Classic Colombia Private Travel Package",
    metaDescription:
      "A 10-night private Colombia itinerary through Bogota, the Coffee Region, Medellin, and Cartagena.",
    featured: true,
    nights: 10,
    cities: ["Bogota", "Coffee Region", "Medellin", "Cartagena"],
    pricePerPersonUsd: 4890,
    shortSummary:
      "A polished first trip to Colombia with art, coffee country, city design, and the Caribbean coast.",
    summary:
      "Classic Colombia is built for travelers who want the country's essential contrasts in one smooth private itinerary. You move from Bogota's museums and mountain views to a working coffee hacienda, Medellin's creative neighborhoods, and Cartagena's walled city, with private guides and time to breathe between transfers.",
    heroImage: {
      src: "/packages/classic-colombia/hero.svg",
      alt: "Layered Colombia landscape placeholder for Classic Colombia",
      width: 1600,
      height: 1000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrive in Bogota",
        city: "Bogota",
        description:
          "Private arrival transfer, hotel check-in, and a gentle evening route through the historic center if timing allows.",
      },
      {
        day: 2,
        title: "Gold, galleries, and Monserrate",
        city: "Bogota",
        description:
          "Explore the Gold Museum, independent galleries, La Candelaria, and the city overlook with a private guide.",
      },
      {
        day: 3,
        title: "Fly to the Coffee Region",
        city: "Coffee Region",
        description:
          "Settle into a countryside hacienda and spend the afternoon among gardens, bamboo, and mountain views.",
      },
      {
        day: 4,
        title: "Coffee from seed to cup",
        city: "Coffee Region",
        description:
          "Visit a family-run coffee farm for a hands-on tasting and a slow lunch rooted in regional produce.",
      },
      {
        day: 5,
        title: "Valle de Cocora and Salento",
        city: "Coffee Region",
        description:
          "Walk beneath wax palms, browse Salento's craft streets, and return for an unhurried hacienda evening.",
      },
      {
        day: 6,
        title: "Medellin by neighborhood",
        city: "Medellin",
        description:
          "Fly to Medellin, then trace the city's transformation through public transit, plazas, and creative districts.",
      },
      {
        day: 7,
        title: "Design, gardens, and local tables",
        city: "Medellin",
        description:
          "Pair botanical gardens and architecture with a chef-led dinner or relaxed neighborhood food route.",
      },
      {
        day: 8,
        title: "Caribbean arrival",
        city: "Cartagena",
        description:
          "Fly to Cartagena and enter the walled city with a private transfer and a golden-hour orientation walk.",
      },
      {
        day: 9,
        title: "Cartagena behind the doors",
        city: "Cartagena",
        description:
          "Visit colonial houses, contemporary ateliers, and shaded plazas before a free late afternoon.",
      },
      {
        day: 10,
        title: "Island day",
        city: "Cartagena",
        description:
          "Spend the day by boat in the Rosario Islands or at a quiet beach club, paced around sea conditions.",
      },
      {
        day: 11,
        title: "Depart Cartagena",
        city: "Cartagena",
        description:
          "Private departure transfer with optional last-minute market or boutique stops when flight timing allows.",
      },
    ],
    included: [
      "Ten hotel nights in handpicked boutique or luxury properties",
      "Daily breakfast",
      "Private airport transfers and intercity ground transfers",
      "Private guiding for the listed core experiences",
      "Domestic flight planning and booking support",
      "Restaurant, room category, and pacing recommendations",
    ],
    notIncluded: [
      "International flights",
      "Domestic airfare unless quoted in the final proposal",
      "Lunches, dinners, and drinks outside listed experiences",
      "Travel insurance",
      "Optional spa, boat upgrades, and special events",
      "Guide and driver gratuities",
    ],
    hotels: [
      {
        name: "Four Seasons Hotel Casa Medina",
        city: "Bogota",
        why: "A character-rich base with architectural detail and easy access to Zona G dining.",
      },
      {
        name: "Hacienda Bambusa",
        city: "Coffee Region",
        why: "A relaxed countryside stay surrounded by gardens, working farms, and mountain air.",
      },
      {
        name: "Elcielo Hotel",
        city: "Medellin",
        why: "A polished city hotel close to restaurants, design shops, and leafy El Poblado streets.",
      },
      {
        name: "Sofitel Legend Santa Clara",
        city: "Cartagena",
        why: "A landmark stay inside the walled city with history, service, and a calm pool courtyard.",
      },
    ],
    caveat:
      "Hotel names are indicative and subject to availability, season, and the final trip brief. Confirmed proposals may substitute a property of similar style and standard.",
  },
  {
    slug: "caribbean-and-coffee",
    name: "Caribbean and Coffee",
    title: "Caribbean and Coffee Colombia Package",
    metaDescription:
      "An 8-night Colombia trip pairing Cartagena and the Caribbean coast with the Coffee Region.",
    featured: true,
    nights: 8,
    cities: ["Cartagena", "Rosario Islands", "Coffee Region"],
    pricePerPersonUsd: 4350,
    shortSummary:
      "For travelers who want warm water, colonial color, and a soft landing in Colombia's coffee country.",
    summary:
      "Caribbean and Coffee is a slower private itinerary that balances Cartagena's architecture and food with island time and the green quiet of the Coffee Region. It is designed for couples, friends, or families who want Colombia's visual drama without changing hotels every other night.",
    heroImage: {
      src: "/packages/caribbean-and-coffee/hero.svg",
      alt: "Caribbean coast and coffee hills placeholder for Caribbean and Coffee",
      width: 1600,
      height: 1000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrive in Cartagena",
        city: "Cartagena",
        description:
          "Private transfer into the walled city and a calm first evening close to your hotel.",
      },
      {
        day: 2,
        title: "Old city and Getsemani",
        city: "Cartagena",
        description:
          "Trace Cartagena's layered history through plazas, private courtyards, and street art with a local guide.",
      },
      {
        day: 3,
        title: "Food, craft, and free time",
        city: "Cartagena",
        description:
          "Market flavors, artisan studios, and a flexible late afternoon for pool time or shopping.",
      },
      {
        day: 4,
        title: "Rosario Islands by boat",
        city: "Rosario Islands",
        description:
          "Boat to clear water and a quiet beach setup, with routing adjusted around wind and sea conditions.",
      },
      {
        day: 5,
        title: "Fly to the Coffee Region",
        city: "Coffee Region",
        description:
          "Travel inland to a hacienda stay and settle into the gardens before dinner.",
      },
      {
        day: 6,
        title: "Coffee farm immersion",
        city: "Coffee Region",
        description:
          "Spend the day with growers, roast profiles, and a regional lunch that keeps the pace unhurried.",
      },
      {
        day: 7,
        title: "Valle de Cocora",
        city: "Coffee Region",
        description:
          "Walk among wax palms and village streets, with a flexible route for different activity levels.",
      },
      {
        day: 8,
        title: "Hacienda day",
        city: "Coffee Region",
        description:
          "Choose horseback riding, a garden morning, or a cooking experience before a relaxed final night.",
      },
      {
        day: 9,
        title: "Depart",
        city: "Coffee Region",
        description:
          "Private transfer to the airport for the flight home or onward Colombia plans.",
      },
    ],
    included: [
      "Eight hotel nights",
      "Daily breakfast",
      "Private airport transfers",
      "Private Cartagena and Coffee Region guiding",
      "Private Rosario Islands boat day or beach club day",
      "Trip pacing and restaurant planning",
    ],
    notIncluded: [
      "International flights",
      "Domestic airfare unless quoted in the final proposal",
      "Meals and drinks not listed in the proposal",
      "Travel insurance",
      "Premium boat, suite, or festive-season supplements",
      "Guide and driver gratuities",
    ],
    hotels: [
      {
        name: "Casa San Agustin",
        city: "Cartagena",
        why: "A refined walled-city address with intimate scale and beautiful colonial details.",
      },
      {
        name: "Hotel Las Islas",
        city: "Baru",
        why: "A beach retreat that works well when the brief calls for a full Caribbean exhale.",
      },
      {
        name: "Hacienda Bambusa",
        city: "Coffee Region",
        why: "A warm, garden-wrapped hacienda with a strong sense of place.",
      },
    ],
    caveat:
      "Island routing depends on weather, port guidance, and sea conditions. The final proposal may adjust timing or substitute an equivalent coastal experience.",
  },
  {
    slug: "andes-to-amazon",
    name: "Andes to Amazon",
    title: "Andes to Amazon Colombia Adventure Package",
    metaDescription:
      "An 11-night private Colombia itinerary from Bogota and Medellin to the Amazon and Cartagena.",
    featured: false,
    nights: 11,
    cities: ["Bogota", "Amazon", "Medellin", "Cartagena"],
    pricePerPersonUsd: 5450,
    shortSummary:
      "A deeper Colombia route for travelers who want rainforest, big-city culture, and coastal ease.",
    summary:
      "Andes to Amazon adds a wilder middle chapter to Colombia's classic route. The trip starts with Bogota's high-altitude culture, drops into the Amazon for guided nature days, then returns through Medellin and Cartagena for design, food, and Caribbean color.",
    heroImage: {
      src: "/packages/andes-to-amazon/hero.svg",
      alt: "Andean peaks and rainforest placeholder for Andes to Amazon",
      width: 1600,
      height: 1000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrive in Bogota",
        city: "Bogota",
        description:
          "Private arrival transfer and an easy evening to adjust to the altitude.",
      },
      {
        day: 2,
        title: "Bogota culture day",
        city: "Bogota",
        description:
          "Museums, markets, mountain views, and a private guide who shapes the day around your interests.",
      },
      {
        day: 3,
        title: "Fly to the Amazon",
        city: "Amazon",
        description:
          "Continue to Leticia and transfer by river or road to your lodge, with a first rainforest briefing.",
      },
      {
        day: 4,
        title: "Rainforest trails",
        city: "Amazon",
        description:
          "Walk interpretive trails with naturalist guides and learn how local communities read the forest.",
      },
      {
        day: 5,
        title: "River villages and wildlife",
        city: "Amazon",
        description:
          "Explore river life, seasonal wildlife routes, and community-led experiences based on water levels.",
      },
      {
        day: 6,
        title: "Return to the Andes",
        city: "Medellin",
        description:
          "Fly back through Bogota to Medellin and settle into a comfortable city base.",
      },
      {
        day: 7,
        title: "Medellin transformation",
        city: "Medellin",
        description:
          "A private route through public spaces, art, cable cars, and neighborhoods shaped by local initiative.",
      },
      {
        day: 8,
        title: "Guatape or design day",
        city: "Medellin",
        description:
          "Choose a lakeside Guatape day or keep it urban with design stores, gardens, and restaurants.",
      },
      {
        day: 9,
        title: "Cartagena arrival",
        city: "Cartagena",
        description:
          "Fly to the coast and step into Cartagena's color, courtyards, and evening breeze.",
      },
      {
        day: 10,
        title: "Cartagena private route",
        city: "Cartagena",
        description:
          "Balance the walled city, Getsemani, and a tailored food or photography angle.",
      },
      {
        day: 11,
        title: "Coast at your pace",
        city: "Cartagena",
        description:
          "A free day for islands, spa time, galleries, or a long lunch arranged around your style.",
      },
      {
        day: 12,
        title: "Depart Cartagena",
        city: "Cartagena",
        description:
          "Private transfer for your international flight or onward extension.",
      },
    ],
    included: [
      "Eleven hotel and lodge nights",
      "Daily breakfast and listed Amazon lodge meals",
      "Private transfers in each city",
      "Private cultural guiding in Bogota, Medellin, and Cartagena",
      "Naturalist-guided Amazon excursions",
      "Domestic flight planning and logistics support",
    ],
    notIncluded: [
      "International flights",
      "Domestic airfare unless quoted in the final proposal",
      "Meals outside the listed lodge plan and city experiences",
      "Travel insurance",
      "Optional upgrades and special access fees",
      "Guide, driver, and lodge staff gratuities",
    ],
    hotels: [
      {
        name: "Four Seasons Hotel Bogota",
        city: "Bogota",
        why: "A polished northern base for dining, galleries, and a soft landing after arrival.",
      },
      {
        name: "Calanoa Amazonas",
        city: "Amazon",
        why: "A forest lodge with strong local roots and guided access to river and rainforest life.",
      },
      {
        name: "Patio del Mundo",
        city: "Medellin",
        why: "An intimate hillside stay with greenery and easy access to El Poblado.",
      },
      {
        name: "Casa Pestagua",
        city: "Cartagena",
        why: "A restored mansion that keeps Cartagena's romance close without feeling oversized.",
      },
    ],
    caveat:
      "Amazon activities shift with river levels, rain, conservation guidance, and lodge operations. Final pacing is confirmed close to travel with safety and comfort in mind.",
  },
  {
    slug: "cartagena-design-escape",
    name: "Cartagena Design Escape",
    title: "Cartagena Design Escape Package",
    metaDescription:
      "A 5-night Cartagena package focused on design, food, private courtyards, and Caribbean downtime.",
    featured: false,
    nights: 5,
    cities: ["Cartagena", "Baru"],
    pricePerPersonUsd: 2850,
    shortSummary:
      "A compact coastal escape with private design routes, considered meals, and easy island time.",
    summary:
      "Cartagena Design Escape is for travelers who want a beautiful short trip without overpacking the schedule. Days center on architecture, interiors, artisans, restaurants, and Caribbean light, with one coastal day built in for a reset.",
    heroImage: {
      src: "/packages/cartagena-design-escape/hero.svg",
      alt: "Cartagena facade and Caribbean water placeholder for Cartagena Design Escape",
      width: 1600,
      height: 1000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrive in Cartagena",
        city: "Cartagena",
        description:
          "Private transfer to the walled city and a relaxed evening close to your hotel.",
      },
      {
        day: 2,
        title: "Architecture and courtyards",
        city: "Cartagena",
        description:
          "A private route through restored houses, plazas, churches, and design-forward public spaces.",
      },
      {
        day: 3,
        title: "Studios and tables",
        city: "Cartagena",
        description:
          "Meet makers, visit boutiques, and anchor the day around a memorable lunch or dinner reservation.",
      },
      {
        day: 4,
        title: "Baru or Rosario Islands",
        city: "Baru",
        description:
          "Head to the coast for beach time, clear water, and a slower Caribbean rhythm.",
      },
      {
        day: 5,
        title: "Free day in the walled city",
        city: "Cartagena",
        description:
          "Keep the day open for a spa appointment, pool time, more shopping, or a photography walk.",
      },
      {
        day: 6,
        title: "Depart",
        city: "Cartagena",
        description:
          "Private transfer to the airport with optional last stops depending on flight timing.",
      },
    ],
    included: [
      "Five hotel nights",
      "Daily breakfast",
      "Private airport transfers",
      "Private design and architecture guiding",
      "One coastal day experience",
      "Restaurant and boutique shortlist",
    ],
    notIncluded: [
      "International flights",
      "Meals and drinks not listed in the proposal",
      "Travel insurance",
      "Spa treatments and private shopping purchases",
      "Festive-season hotel supplements",
      "Guide and driver gratuities",
    ],
    hotels: [
      {
        name: "Amarla Boutique Hotel",
        city: "Cartagena",
        why: "A small, design-minded base with rooftop views and a strong sense of place.",
      },
      {
        name: "Casa Yahri",
        city: "Cartagena",
        why: "An intimate restored house that suits travelers who prefer privacy and texture.",
      },
      {
        name: "Hotel Las Islas",
        city: "Baru",
        why: "A smart option when the escape needs a true beach chapter after the city.",
      },
    ],
    caveat:
      "Cartagena hotels are small and book early, especially over holidays and festival dates. Final options depend on availability at proposal approval.",
  },
];

export function getAllPackages() {
  return packages;
}

export function getFeaturedPackages() {
  return packages.filter((travelPackage) => travelPackage.featured);
}

export function getAllPackageSlugs() {
  return packages.map((travelPackage) => travelPackage.slug);
}

export function getPackageBySlug(slug: string) {
  return packages.find((travelPackage) => travelPackage.slug === slug);
}
