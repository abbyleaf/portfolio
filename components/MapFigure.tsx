import Image from "next/image";
import { LoopVideo } from "./LoopVideo";

const lineColours = {
  orange: "bg-vermilion-500",
  blue: "bg-azure-55",
};

type MapFigureProps = {
  /** Title in the bar above the map. */
  title: string;
  /** Describes the map for people who cannot see it. */
  label: string;
  /** A looping clip of the map. Until there is one, the still is shown. */
  video?: string;
  /** The map as a picture: the placeholder before the clip loads, and its stand-in. */
  still: { src: string; width: number; height: number };
  /** What each coloured line stands for. */
  legend: { colour: keyof typeof lineColours; label: string }[];
};

/** A framed map: title bar, the map (a looping clip), then a key to its lines. */
export function MapFigure({ title, label, video, still, legend }: MapFigureProps) {
  return (
    <figure className="flex flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-raised">
      <figcaption className="border-b-(length:--stroke-rule) border-border-canvas-subtle px-item-20 py-item-16 font-mono text-mono-legend uppercase text-text-primary">
        {title}
      </figcaption>
      <div className="flex justify-center px-item-20 py-item-20">
        <div className="relative aspect-map-figure w-full max-w-width-640">
        {video ? (
          <LoopVideo
            src={video}
            poster={still.src}
            label={label}
            className="size-full object-contain"
          />
        ) : (
          <Image
            src={still.src}
            alt={label}
            width={still.width}
            height={still.height}
            sizes="(min-width: 40rem) 640px, 100vw"
            className="size-full object-contain"
          />
        )}
        </div>
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
