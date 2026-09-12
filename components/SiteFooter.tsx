import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/seo";

const tripLinks = [
  { label: "Colombia", href: "/#regions" },
  { label: "Packages", href: "/packages" },
  { label: "Guide", href: "/#guide" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const phoneLabel = "+1 (917) 780-9875";
const phoneHref = "tel:+19177809875";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="site-footer-grid">
          <div>
            <Link
              href="/"
              className="footer-brand"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-sm text-base leading-7">
              Private Colombia travel planning with boutique hotels, trusted
              local guides, and thoughtful pacing from start to finish.
            </p>
            <p className="mt-5 text-sm font-medium">
              US phone:{" "}
              <Link href={phoneHref} className="footer-link">
                {phoneLabel}
              </Link>
            </p>
          </div>

          <FooterLinkColumn title="Trips" links={tripLinks} />
          <FooterLinkColumn title="Company" links={companyLinks} />

          <div>
            <p className="footer-column-title">
              Start with Colombia
            </p>
            <p className="mt-3 small-text">
              We will map the right Colombia route before any planning begins.
            </p>
            <ButtonLink href="/plan" className="mt-5 w-full sm:w-fit">
              Plan a trip
            </ButtonLink>
            <div className="mt-7 flex gap-6">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  <SocialIcon label={social.label} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom mt-12">
          <div>
            <p>Website by Cleopatra Solutions</p>
            <p className="mt-2">
              Copyright 2026 {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="footer-column-title">{title}</p>
      <div className="mt-4 grid gap-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="footer-link w-fit">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "Instagram":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect
            width="16"
            height="16"
            x="4"
            y="4"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="7" r="1.1" fill="currentColor" />
        </svg>
      );
    case "TikTok":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16.9 5.1c.7 1.7 2 2.9 3.9 3.1v3.2a7.8 7.8 0 0 1-3.8-1.2v5.4c0 3.1-2.1 5.2-5.1 5.2a4.9 4.9 0 0 1-5.1-4.9c0-2.9 2.3-5 5.2-5 .4 0 .7 0 1 .1v3.3c-.3-.1-.6-.2-1-.2-1.1 0-1.9.7-1.9 1.7s.8 1.8 1.9 1.8 1.9-.7 1.9-2.1V3.2h3z" />
        </svg>
      );
    default:
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 1.9 12c0 1.6.2 3.2.5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.6.5-3.2.5-4.8s-.2-3.2-.5-4.8ZM10 15.4V8.6l5.8 3.4z" />
        </svg>
      );
  }
}
