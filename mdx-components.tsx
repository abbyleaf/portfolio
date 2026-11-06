import type { MDXComponents } from "mdx/types";
import { MapFigure } from "@/components/MapFigure";
import {
  Figure,
  ImageFigure,
  ImageText,
  Mark,
  Pair,
  Quote,
  ScreenCompare,
  Section,
  ServiceCompare,
  Showcase,
  Shot,
  Stat,
  Stats,
  Subhead,
  VideoFigure,
} from "@/components/CaseStudyBlocks";

/**
 * Wraps the part of a case study that needs the password. Visitors with the password see it
 * as normal; for everyone else the locked page replaces it with the password box.
 */
function Locked({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const components: MDXComponents = {
  p: (props) => (
    <p className="font-sans text-paragraph-md text-text-muted" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-text-muted" {...props} />,
  Figure,
  ImageFigure,
  ImageText,
  Locked,
  MapFigure,
  Mark,
  Pair,
  Quote,
  ScreenCompare,
  Section,
  ServiceCompare,
  Showcase,
  Shot,
  Stat,
  Stats,
  Subhead,
  VideoFigure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
