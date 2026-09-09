import Link from "next/link";
import { SITE_NAME, SITE_PHONE_PLACEHOLDER } from "@/lib/seo";

const footerNavItems = [
  { label: "Colombia", href: "/colombia" },
  { label: "Packages", href: "/packages" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-hair">
      <div className="site-gutter grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <Link href="/" className="footer-link font-heading text-2xl font-bold">
            {SITE_NAME}
          </Link>
          <p className="mt-4 max-w-sm text-base leading-7">
            Private Colombia travel planning with boutique hotels, trusted
            guides, and thoughtful pacing.
          </p>
          <p className="mt-5 text-sm font-semibold">
            US phone: {SITE_PHONE_PLACEHOLDER}
          </p>
          <Link href="/plan" className="btn-primary mt-6">
            Book a free call
          </Link>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Footer">
          {footerNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="footer-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <p className="font-heading text-sm font-bold uppercase">Socials</p>
          <div className="mt-4 grid gap-3 text-sm">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="footer-link w-fit font-semibold"
              >
                {social.label}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm">
            Copyright 2026 {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
