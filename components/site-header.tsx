import Link from "next/link";

const navItems = [
  { label: "Colombia", href: "/colombia" },
  { label: "Packages", href: "/packages" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-bold text-[#1f3d35]"
          aria-label="Ali Travel Frames home"
        >
          Ali Travel Frames
        </Link>
        <nav
          className="order-3 flex w-full gap-5 overflow-x-auto border-t border-stone-200 pt-3 text-sm font-semibold text-stone-700 lg:order-none lg:ml-8 lg:w-auto lg:flex-1 lg:border-0 lg:pt-0"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 transition hover:text-[#b35b3b]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/plan"
          className="ml-auto inline-flex min-h-11 items-center justify-center rounded-md bg-[#1f5f4a] px-4 py-2 font-heading text-sm font-bold text-white shadow-sm transition hover:bg-[#174737]"
        >
          Book a free call
        </Link>
      </div>
    </header>
  );
}
