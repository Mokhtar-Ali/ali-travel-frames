import type { MetadataRoute } from "next";
import { getAllPackageSlugs } from "@/content/packages/index";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/colombia",
    "/egypt",
    "/packages",
    ...getAllPackageSlugs().map((slug) => `/packages/${slug}`),
    "/reviews",
    "/about",
    "/plan",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));
}
