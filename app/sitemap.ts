import type { MetadataRoute } from "next";
import { getAllPackageSlugs } from "@/content/packages/index";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/packages",
    ...getAllPackageSlugs().map((slug) => `/packages/${slug}`),
    "/reviews",
    "/plan",
    "/about",
    "/egypt",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));
}
