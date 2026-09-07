import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_PHONE_PLACEHOLDER,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  titleTemplate: true,
});

const travelAgencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: SITE_PHONE_PLACEHOLDER,
  areaServed: ["United States", "Colombia"],
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/",
    "https://www.tiktok.com/",
    "https://www.youtube.com/",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${sourceSerif.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd id="travel-agency-json-ld" data={travelAgencyJsonLd} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
