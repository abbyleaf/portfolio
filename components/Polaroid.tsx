import type { Testimonial } from "@/content/home";

const tones = {
  canvas: "bg-surface-canvas",
  warm: "bg-surface-accent-warm",
  cool: "bg-surface-light-accent-cool",
};

const tilts = {
  none: "",
  left: "rotate-(--rotate-polaroid-left)",
  right: "rotate-(--rotate-polaroid-right)",
};

export function Polaroid({ quote, name, role, tone, tilt }: Testimonial) {
  return (
    <figure
      className={`flex h-item-320 w-item-260 shrink-0 flex-col gap-item-10 bg-surface-raised p-item-10 drop-shadow-polaroid ${tilts[tilt]}`}
    >
      <blockquote
        className={`flex flex-1 items-center justify-center p-item-24 text-center font-sans text-paragraph-md font-medium text-text-primary/75 ${tones[tone]}`}
      >
        <p>“{quote}”</p>
      </blockquote>
      <figcaption className="text-center font-mono text-mono-m uppercase tracking-caption text-text-accent-warm">
        {name} · {role}
      </figcaption>
    </figure>
  );
}
