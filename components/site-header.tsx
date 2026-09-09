"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Colombia", href: "/colombia" },
  { label: "Packages", href: "/packages" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-hair bg-surface">
      <div className="site-header-inner py-4">
        <Link
          href="/"
          className="justify-self-start font-heading text-xl font-bold text-ink"
          aria-label="Ali Travel Frames home"
        >
          Ali Travel Frames
        </Link>
        <nav
          className="site-header-nav text-sm font-semibold"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <HeaderNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
        <Link href="/plan" className="btn-primary justify-self-end">
          Book a free call
        </Link>
      </div>
    </header>
  );
}

function HeaderNavLink({
  item,
  pathname,
}: {
  item: (typeof navItems)[number];
  pathname: string;
}) {
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`site-nav-link ${isActive ? "site-nav-link-active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}
