import type { Testimonial } from "@/content/home";
import { Polaroid } from "./Polaroid";

function Row({
  testimonials,
  hidden,
}: {
  testimonials: Testimonial[];
  hidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 gap-item-40 pr-item-40 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {testimonials.map((testimonial) => (
        <li key={testimonial.name} className="shrink-0 px-item-14 py-item-10">
          <Polaroid {...testimonial} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Polaroids drift sideways like the marquee strips and hold still while one is
 * hovered or focused. With reduced motion it is a plain scrollable row.
 */
export function TestimonialMarquee({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div
      role="region"
      aria-label="Testimonials"
      className="w-full overflow-hidden pb-item-40 motion-reduce:overflow-x-auto"
    >
      <div className="flex w-max animate-marquee-slow marquee-pause-on-hover motion-reduce:animate-none">
        <Row testimonials={testimonials} />
        <Row testimonials={testimonials} hidden />
      </div>
    </div>
  );
}
