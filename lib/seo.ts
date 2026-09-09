import type { Metadata } from "next";

export const SITE_NAME = "Ali Travel Frames";
export const SITE_URL = "https://alitravelframes.com";
export const SITE_DESCRIPTION =
  "Private Colombia travel planning for design-minded travelers, couples, and families.";
export const SITE_PHONE_PLACEHOLDER = "+1 (000) 000-0000";

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  titleTemplate?: boolean;
};

function normalizePath(path = "/") {
  return path.startsWith("/") ? path : `/${path}`;
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
      images: [
        {
          url: image,
          width: 1600,
          height: 1000,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
