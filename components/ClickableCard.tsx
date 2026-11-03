"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * An `article` that opens `href` when any part of it is clicked, while its text stays
 * selectable: a click that ends a drag-select, or lands on a real link or button, is
 * left alone. The card still holds a real link, so keyboard and screen-reader users
 * are not affected.
 */
export function ClickableCard({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (!href || event.defaultPrevented || event.button !== 0) return;
    if ((event.target as Element).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    if (event.metaKey || event.ctrlKey) window.open(href, "_blank");
    else router.push(href);
  };

  return (
    <article
      onClick={onClick}
      className={`${href ? "cursor-pointer" : ""} ${className ?? ""}`}
    >
      {children}
    </article>
  );
}
