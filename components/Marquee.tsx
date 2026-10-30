type MarqueeProps = {
  items: string[];
  label: string;
  /** Which way the strip travels. */
  direction?: "left" | "right";
  /** Dark ink strip, or the warm pink one. */
  tone?: "dark" | "warm";
};

const tones = {
  dark: {
    band: "bg-surface-inverted",
    text: "text-text-on-inverted",
    glyph: "text-red-300",
  },
  warm: {
    band: "bg-surface-accent-warm",
    text: "text-text-accent-warm",
    glyph: "text-red-600",
  },
};

function Strip({
  items,
  hidden,
  tone,
}: {
  items: string[];
  hidden?: boolean;
  tone: keyof typeof tones;
}) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-item-56 pr-item-56"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-item-56">
          <span className={`whitespace-nowrap font-sans text-heading-inter-sm uppercase tracking-marquee ${tones[tone].text}`}>
            {item}
          </span>
          <span aria-hidden="true" className={`text-glyph ${tones[tone].glyph}`}>
            ✶
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Strip of looping text. The second copy is hidden from assistive tech. */
export function Marquee({
  items,
  label,
  direction = "left",
  tone = "dark",
}: MarqueeProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className={`overflow-hidden py-item-26 ${tones[tone].band}`}
    >
      <div
        className={`flex w-max motion-reduce:animate-none motion-reduce:pl-item-56 ${
          direction === "right" ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        <Strip items={items} tone={tone} />
        <Strip items={items} tone={tone} hidden />
      </div>
    </div>
  );
}
