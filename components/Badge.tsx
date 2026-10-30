import type { ReactNode } from "react";

type BadgeProps = {
  tone: "neutral" | "warm";
  tilt: "left" | "right";
  /** Shows the green "available" dot before the label. */
  status?: boolean;
  /** Shows the ★ before the label, sized to the Figma badge. */
  star?: boolean;
  children: ReactNode;
};

const tones = {
  neutral: "bg-surface-canvas text-text-primary",
  warm: "bg-surface-accent-warm text-text-accent-warm",
};

const tilts = {
  left: "rotate-(--rotate-tilt-left)",
  right: "rotate-(--rotate-tilt-right)",
};

/** Tilted pill with a hard offset shadow. */
export function Badge({ tone, tilt, status, star, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-item-8 whitespace-nowrap rounded-pill border-(length:--stroke-hairline) border-border-strong px-item-16 py-item-9 font-mono text-mono-m uppercase shadow-badge motion-safe:hover:animate-wiggle ${tones[tone]} ${tilts[tilt]}`}
    >
      {status && (
        <span
          aria-hidden="true"
          className="size-item-7 bg-green-500 shadow-status-dot"
        />
      )}
      {star && (
        <span aria-hidden="true" className="-translate-y-item-2 text-mono-badge-star">
          ★
        </span>
      )}
      {children}
    </span>
  );
}
