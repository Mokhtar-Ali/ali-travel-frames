import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  buildMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Ali Travel Frames | Private Colombia & Egypt Travel Planning",
  description: SITE_DESCRIPTION,
  path: "/",
});

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: "https://alitravelframes.com",
    description: SITE_DESCRIPTION,
    telephone: "+19177809875",
    areaServed: ["Colombia", "Egypt"],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(travelAgencyJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFloat />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RG8G63M53T"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RG8G63M53T');
          `}
        </Script>
      </body>
    </html>
  );
}
