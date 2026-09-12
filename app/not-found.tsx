import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="page-section bg-paper text-ink">
      <div className="section-inner">
      <p className="eyebrow">404</p>
      <h1 className="display-title mt-5 max-w-[12ch]">
        This page is not in the frame
      </h1>
      <p className="mt-7 max-w-[52ch]">
        The page may have moved, or the route may not exist yet.
      </p>
      <ButtonLink
        href="/"
        className="mt-10"
      >
        Return home
      </ButtonLink>
      </div>
    </section>
  );
}
