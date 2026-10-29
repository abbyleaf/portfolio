type RulerProps = {
  /** Which edge the tick marks grow from. */
  edge: "top" | "bottom";
  left: string;
  right: string;
};

const TICK_COUNT = 33;

/**
 * Printed-ruler strip used as a page header rule and as a section separator.
 * The ticks fill the space between the two labels and drop off from the ends
 * as the strip narrows, so they never run under the text.
 */
export function Ruler({ edge, left, right }: RulerProps) {
  const isTop = edge === "top";
  return (
    <div
      className={`h-item-m shrink-0 bg-surface-canvas px-item-64 font-mono text-stamp-xs uppercase text-text-primary ${
        isTop
          ? "border-t-(length:--stroke-sticker) border-b-(length:--stroke-hairline) border-border-strong"
          : "border-t-(length:--stroke-hairline) border-b-(length:--stroke-sticker) border-border-strong"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-width-1312 items-center justify-between">
        <span className="shrink-0">{left}</span>
        <div
          aria-hidden="true"
          className={`mx-item-52 flex min-w-0 flex-1 justify-center gap-item-m self-stretch overflow-hidden ${
            isTop ? "items-end" : "items-start"
          }`}
        >
          {Array.from({ length: TICK_COUNT }, (_, i) => (
            <span
              key={i}
              className={`w-px shrink-0 bg-grey-900 ${i % 4 === 0 ? "h-item-12" : "h-item-6"}`}
            />
          ))}
        </div>
        <span className="shrink-0">{right}</span>
      </div>
    </div>
  );
}
