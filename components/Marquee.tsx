type MarqueeProps = {
  items: string[];
  label: string;
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
export function Marquee({ items, label }: MarqueeProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className="overflow-hidden bg-surface-inverted py-item-26"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none motion-reduce:pl-item-56">
        <Strip items={items} />
        <Strip items={items} hidden />
      </div>
    </div>
  );
}
