import type { Metadata } from "next";

export const SITE_NAME = "Ali Travel Frames";
export const SITE_URL = "https://alitravelframes.com";
export const SITE_DESCRIPTION =
  "Private travel planning for Colombia and Egypt";
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
      images: image
        ? [
            {
              url: image,
              width: 1600,
              height: 1000,
              alt: imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
