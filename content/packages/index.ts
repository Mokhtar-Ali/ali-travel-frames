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

export const packages: Package[] = [
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

export const getPackage = (slug: string): Package | undefined =>
  packages.find((p) => p.slug === slug);

export const getPackageBySlug = getPackage;

export const getAllPackages = (): Package[] => packages;

export const getAllPackageSlugs = (): string[] => packages.map((p) => p.slug);

export const getFeaturedPackages = (): Package[] =>
  packages.filter((p) => p.featured);

export type { Package } from '../types';
