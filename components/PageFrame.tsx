import type { ReactNode } from "react";
import { Ruler } from "./Ruler";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyTop } from "./StickyTop";

type PageFrameProps = {
  /** Label at the left of the top ruler, e.g. "Abi / Work". */
  topLabel: string;
  /** Label at the left of the bottom ruler, e.g. "WORK / END". */
  bottomLabel: string;
  children: ReactNode;
};

/** Pinned header and ruler, the page body, then the closing ruler and footer. */
export function PageFrame({ topLabel, bottomLabel, children }: PageFrameProps) {
  return (
    <div className="flex flex-1 flex-col bg-surface-primary">
      <StickyTop>
        <SiteHeader />
        <Ruler edge="top" left={topLabel} right="Folio/26" star />
      </StickyTop>
      <main className="flex flex-col">{children}</main>
      <Ruler edge="bottom" left={bottomLabel} right="EST. 2026" />
      <SiteFooter />
    </div>
  );
}
