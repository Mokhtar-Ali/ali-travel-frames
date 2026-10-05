import type { Package } from '../types';
import { medellinGuatape } from './medellin-guatape';
import { coffeeRegion } from './coffee-region';
import { cartagenaRosario } from './cartagena-rosario';
import { santaMartaMincaTayrona } from './santa-marta-minca-tayrona';
import { medellinCoffeeRegion } from './medellin-coffee-region';
import { cartagenaCoffeeRegion } from './cartagena-coffee-region';
import { medellinCartagena } from './medellin-cartagena';
import { sanAndresProvidencia } from './san-andres-providencia';
import { caribbeanCoast } from './caribbean-coast';
import { colombiaHighlights } from './colombia-highlights';
import { egyptPackages } from './egypt';

export const colombiaPackages: Package[] = [
  medellinGuatape,
  coffeeRegion,
  cartagenaRosario,
  santaMartaMincaTayrona,
  medellinCoffeeRegion,
  cartagenaCoffeeRegion,
  medellinCartagena,
  sanAndresProvidencia,
  caribbeanCoast,
  colombiaHighlights,
];

export { egyptPackages };

export const allPackages: Package[] = [
  ...colombiaPackages,
  ...egyptPackages,
];

export const getPackage = (slug: string): Package | undefined =>
  allPackages.find((travelPackage) => travelPackage.slug === slug);

export const getPackageBySlug = getPackage;

export const getAllPackages = (): Package[] => allPackages;

export const getAllPackageSlugs = (): string[] =>
  allPackages.map((travelPackage) => travelPackage.slug);

export const getFeaturedPackages = (
  country: Package["country"],
): Package[] =>
  allPackages.filter(
    (travelPackage) =>
      travelPackage.country === country && travelPackage.featured,
  );

export type { Package } from '../types';
