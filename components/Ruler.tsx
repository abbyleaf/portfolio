import { RulerLabel } from "./RulerLabel";
import { Star } from "./Star";
import { TickRow } from "./TickRow";

type RulerProps = {
  /** Which edge the tick marks grow from. */
  edge: "top" | "bottom";
  left: string;
  right: string;
  /** Shows the ★ before the right label, sized to the Figma ruler. */
  star?: boolean;
};

/**
 * Printed-ruler strip used as a page header rule and as a section separator.
 * The ticks fill the space between the two labels and drop off from the ends
 * as the strip narrows, so they never run under the text.
 */
export function Ruler({ edge, left, right, star }: RulerProps) {
  const isTop = edge === "top";
  return (
    <div
      className={`h-item-30 shrink-0 bg-surface-canvas px-item-64 max-xl:px-item-40 max-md:px-item-24 font-mono text-stamp-xs uppercase text-text-primary ${
        isTop
          ? "border-t-(length:--stroke-sticker) border-b-(length:--stroke-hairline) border-border-strong"
          : "border-t-(length:--stroke-hairline) border-b-(length:--stroke-sticker) border-border-strong"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-width-1312 items-center justify-between">
        <RulerLabel label={left} hint={isTop} />
        <TickRow isTop={isTop} />
        <span className="flex shrink-0 items-center gap-item-6">
          {star && <Star className="size-item-8" />}
          {right}
        </span>
      </div>
    </div>
  );
}
