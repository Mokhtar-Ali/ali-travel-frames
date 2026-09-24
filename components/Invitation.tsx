import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";

type InvitationProps = {
  country?: "Colombia" | "Egypt";
  href?: string;
};

export function Invitation({
  country = "Colombia",
  href = "/plan",
}: InvitationProps) {
  return (
    <Reveal className="home-section bg-paper">
      <div className="section-inner text-center">
        <h2 className="display-title mx-auto max-w-[12ch]">
          Bring me the trip you keep imagining
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch]">
          We will turn the rough idea into a {country} plan with rhythm, taste,
          and a real point of view.
        </p>
        <ButtonLink href={href} className="mt-10">
          Plan a trip
        </ButtonLink>
      </div>
    </Reveal>
  );
}
