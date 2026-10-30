import Image from "next/image";
import { LoopVideo } from "./LoopVideo";

const covers: Record<string, { src: string; alt: string }> = {
  "order-splitting": {
    src: "/images/home/case-study-2-cover.png",
    alt: "Soft green and lilac gradient cover for the order splitting case study",
  },
  "manual-route-planning": {
    src: "/images/home/case-study-3-cover.png",
    alt: "Route planning interface on a desktop monitor",
  },
};

/** The picture shown in a case study card, chosen by slug. */
export function ProjectCover({ slug }: { slug: string }) {
  if (slug === "campus-ride-booking") {
    return (
      <LoopVideo
        src="/videos/case-study-1-hero.mp4"
        label="Campus ride app showing shuttle and on-demand booking side by side"
        className="size-full object-cover"
      />
    );
  }
  if (slug === "problem-framing") {
    return (
      <LoopVideo
        src="/videos/case-study-4-hero.mp4"
        label="Animated browser window on a soft blue and orange gradient"
        className="size-full object-cover"
      />
    );
  }
  if (slug === "delivery-plan-editing") {
    return (
      <LoopVideo
        src="/videos/case-study-5-hero.mp4"
        label="Animated inline cell editing in a delivery plan table"
        className="size-full object-cover"
      />
    );
  }
  const cover = covers[slug];
  if (!cover) return null;
  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      fill
      sizes="(min-width: 1024px) 40vw, 100vw"
      className="object-cover"
    />
  );
}
