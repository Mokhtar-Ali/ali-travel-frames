import Link from "next/link";

export default function NotFound() {
  return (
    <section className="site-gutter bg-paper py-20 text-ink">
      <p className="font-heading text-sm font-bold uppercase text-gold">404</p>
      <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-[1.04]">
        This page is not in the frame
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink">
        The page may have moved, or the route may not exist yet.
      </p>
      <Link
        href="/"
        className="btn-primary mt-8"
      >
        Return home
      </Link>
    </section>
  );
}
