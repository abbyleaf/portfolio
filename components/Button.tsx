import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "filled" | "outline";
  /** Opens in a new tab; use for files and other sites. */
  newTab?: boolean;
  children: ReactNode;
};

const variants = {
  filled: "bg-surface-inverted text-text-on-inverted",
  outline:
    "border-(length:--stroke-hairline) border-border-strong bg-surface-primary text-text-primary",
};

/** Square button link; lifts up-left on hover with a hard azure shadow. */
export function Button({
  href,
  variant = "filled",
  newTab,
  children,
}: ButtonProps) {
  return (
    <a
      href={href}
      {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
      className={`flex h-item-40 items-center justify-center px-item-24 font-sans text-label-link transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover ${variants[variant]}`}
    >
      {children}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
