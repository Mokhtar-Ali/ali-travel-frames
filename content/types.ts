export type PackageItineraryDay = {
  day: number;
  title: string;
  body: string;
};

export type PackageHotel = {
  name: string;
  city: string;
  why: string;
};

export type Package = {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  nights: number;
  days: number;
  priceFrom: number;
  cities: string[];
  featured: boolean;
  heroImage: string;
  gallery: string[];
  summary: string;
  itinerary: PackageItineraryDay[];
  included: string[];
  excluded: string[];
  hotels: PackageHotel[];
  caveat: string;
};
