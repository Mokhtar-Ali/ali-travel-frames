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
    <footer className="border-t border-stone-200 bg-[#17382f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-heading text-2xl font-bold">
            {SITE_NAME}
          </Link>
          <p className="mt-4 max-w-sm text-base leading-7 text-stone-200">
            Private Colombia travel planning with boutique hotels, trusted
            guides, and thoughtful pacing.
          </p>
          <p className="mt-5 text-sm font-semibold text-stone-100">
            US phone: {SITE_PHONE_PLACEHOLDER}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Footer">
          {footerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-stone-200 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <p className="font-heading text-sm font-bold uppercase text-[#f2c16b]">
            Socials
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-stone-100 transition hover:border-white hover:text-white"
              >
                {social.label}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-stone-300">
            Copyright 2026 {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
