type MarqueeProps = {
  items: string[];
  label: string;
  /** Which way the strip travels. */
  direction?: "left" | "right";
};

function Strip({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-item-56 pr-item-56"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-item-56">
          <span className="whitespace-nowrap font-sans text-heading-inter-sm uppercase tracking-marquee text-text-on-inverted">
            {item}
          </span>
          <span aria-hidden="true" className="text-glyph text-red-300">
            ✶
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Dark strip of looping text. The second copy is hidden from assistive tech. */
export function Marquee({ items, label, direction = "left" }: MarqueeProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className="overflow-hidden bg-surface-inverted py-item-26"
    >
      <div
        className={`flex w-max motion-reduce:animate-none motion-reduce:pl-item-56 ${
          direction === "right" ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        <Strip items={items} />
        <Strip items={items} hidden />
      </div>
    </div>
  );
}
