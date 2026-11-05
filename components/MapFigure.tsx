const markers = {
  // A short solid line in a route colour.
  orange: "h-item-4 w-item-20 bg-vermilion-500",
  blue: "h-item-4 w-item-20 bg-azure-55",
  // A top stop: filled circle with an ink outline.
  dot: "size-item-14 rounded-pill border-(length:--stroke-hairline) border-border-strong bg-vermilion-500",
  // Frequent routes: a dashed line.
  dashed: "h-item-3 w-item-m dashed-route",
};

type MapFigureProps = {
  /** Title in the bar above the map. */
  title: string;
  /** Muted note at the right end of the title bar. */
  note?: string;
  /** Describes the map for people who cannot see it. */
  label: string;
  /** The animated map (an SVG with its animation built in). */
  animated: string;
  /** The same map without the animation, for visitors who prefer reduced motion. */
  still: string;
  /** Natural size of the map files, to keep its shape while it loads. */
  size: { width: number; height: number };
  /** What each marker in the key stands for. */
  legend: { marker: keyof typeof markers; label: string }[];
};

/**
 * A framed map: title bar, the map, then a key. The map is a plain <img> because
 * next/image does not optimise SVGs, and an SVG's own animation only runs when it is
 * loaded as an image.
 */
export function MapFigure({
  title,
  note,
  label,
  animated,
  still,
  size,
  legend,
}: MapFigureProps) {
  return (
    <figure className="flex flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-raised">
      <figcaption className="flex items-center justify-between gap-item-20 border-b-(length:--stroke-rule) border-border-canvas-subtle px-item-20 py-item-16 font-mono text-mono-legend uppercase">
        <span className="text-text-primary">{title}</span>
        {note && <span className="text-right text-text-muted">{note}</span>}
      </figcaption>
      <div className="px-item-64 py-item-20 max-md:px-item-24 max-xs:px-item-12">
        <picture>
          <source srcSet={still} media="(prefers-reduced-motion: reduce)" />
          <img
            src={animated}
            alt={label}
            width={size.width}
            height={size.height}
            className="h-auto w-full"
          />
        </picture>
      </div>
      <ul className="flex flex-wrap gap-x-item-40 gap-y-item-12 border-t-(length:--stroke-rule) border-border-canvas-subtle px-item-20 py-item-16">
        {legend.map(({ marker, label: text }) => (
          <li
            key={text}
            className="flex items-center gap-item-12 font-mono text-mono-legend uppercase text-text-muted"
          >
            <span aria-hidden="true" className={`shrink-0 ${markers[marker]}`} />
            {text}
          </li>
        ))}
      </ul>
    </figure>
  );
}
