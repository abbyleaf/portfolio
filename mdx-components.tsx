import type { MDXComponents } from "mdx/types";
import { MapFigure } from "@/components/MapFigure";
import {
  Figure,
  Mark,
  Pair,
  Quote,
  Section,
  ServiceCompare,
  Showcase,
  Stat,
  Stats,
  Subhead,
  VideoFigure,
} from "@/components/CaseStudyBlocks";

const components: MDXComponents = {
  p: (props) => (
    <p className="font-sans text-paragraph-md text-text-muted" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-text-muted" {...props} />,
  Figure,
  MapFigure,
  Mark,
  Pair,
  Quote,
  Section,
  ServiceCompare,
  Showcase,
  Stat,
  Stats,
  Subhead,
  VideoFigure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
