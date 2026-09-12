"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

const navItems = [
  { label: "Colombia", href: "/#regions" },
  { label: "Packages", href: "/packages" },
  { label: "Guides", href: "/#guide" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="justify-self-start"
          aria-label="Ali Travel Frames home"
        >
          <Image
            src="/brand/logo.png"
            alt="Ali Travel Frames"
            width={168}
            height={112}
            loading="lazy"
            className="h-11 w-auto min-[900px]:h-14"
          />
        </Link>
        <nav
          className="site-header-nav"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <HeaderNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
        <ButtonLink href="/plan" className="site-header-cta">
          Book a free call
        </ButtonLink>
        <button
          className="site-menu-toggle"
          type="button"
          aria-controls="site-mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="site-menu-lines" />
        </button>
      </div>
      <div
        id="site-mobile-menu"
        className="site-header-panel"
        hidden={!isMenuOpen}
      >
        {navItems.map((item) => (
          <HeaderNavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onNavigate={() => setIsMenuOpen(false)}
          />
        ))}
        <ButtonLink
          href="/plan"
          className="mt-2 w-full"
          onClick={() => setIsMenuOpen(false)}
        >
          Book a free call
        </ButtonLink>
      </div>
    </header>
  );
}

function HeaderNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : item.href.includes("#")
        ? false
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`site-nav-link ${isActive ? "site-nav-link-active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}
