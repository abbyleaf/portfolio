const lineColours = {
  orange: "bg-vermilion-500",
  blue: "bg-azure-55",
};

type MapFigureProps = {
  /** Title in the bar above the map. */
  title: string;
  /** Describes the map for people who cannot see it. */
  label: string;
  /** The animated map (an SVG with the bus loop built in). */
  animated: string;
  /** The same map without the bus, for visitors who prefer reduced motion. */
  still: string;
  /** What each coloured line stands for. */
  legend: { colour: keyof typeof lineColours; label: string }[];
};

/**
 * A framed map: title bar, the map, then a key to its lines. The map is a plain <img>
 * because next/image does not optimise SVGs, and the SVG's own animation only runs when
 * it is loaded as an image.
 */
export function MapFigure({ title, label, animated, still, legend }: MapFigureProps) {
  return (
    <figure className="flex flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-raised">
      <figcaption className="border-b-(length:--stroke-rule) border-border-canvas-subtle px-item-20 py-item-16 font-mono text-mono-legend uppercase text-text-primary">
        {title}
      </figcaption>
      <div className="py-item-20">
        <picture>
          <source srcSet={still} media="(prefers-reduced-motion: reduce)" />
          <img
            src={animated}
            alt={label}
            width={640}
            height={342}
            className="h-auto w-full"
          />
        </picture>
      </div>
      <ul className="flex flex-wrap gap-x-item-40 gap-y-item-12 border-t-(length:--stroke-rule) border-border-canvas-subtle px-item-20 py-item-16">
        {legend.map(({ colour, label: text }) => (
          <li
            key={text}
            className="flex items-center gap-item-12 font-mono text-mono-legend uppercase text-text-muted"
          >
            <span
              aria-hidden="true"
              className={`h-item-4 w-item-20 shrink-0 ${lineColours[colour]}`}
            />
            {text}
          </li>
        ))}
      </ul>
    </figure>
  );
}
