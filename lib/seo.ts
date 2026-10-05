import type { Metadata } from "next";
import { publicAssetExists } from "@/lib/public-assets";

export const SITE_NAME = "Ali Travel Frames";
export const SITE_URL = "https://alitravelframes.com";
export const SITE_DESCRIPTION =
  "VIP travel planning for Colombia and Egypt, with private journeys, personal concierge support, and trusted local expertise.";
export const SITE_PHONE_PLACEHOLDER = "+1 (917) 780-9875";

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  imageAlt?: string;
  noIndex?: boolean;
  titleTemplate?: boolean;
};

function normalizePath(path = "/") {
  const relativePath = path.startsWith("/") ? path : `/${path}`;
  return new URL(relativePath, SITE_URL).pathname;
}

export function buildMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  path = "/",
  image = "/packages/colombia-highlights/hero.jpg",
  imageAlt = SITE_NAME,
  noIndex = false,
  titleTemplate = false,
}: BuildMetadataOptions = {}): Metadata {
  const canonicalPath = normalizePath(path);
  const socialImage = image && publicAssetExists(image) ? image : null;

  return {
    metadataBase: new URL(SITE_URL),
    title: titleTemplate
      ? {
          default: title,
          template: `%s | ${SITE_NAME}`,
        }
      : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
