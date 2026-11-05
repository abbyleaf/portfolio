import type { MDXComponents } from "mdx/types";
import { MapFigure } from "@/components/MapFigure";
import {
  Figure,
  ImageFigure,
  Mark,
  Pair,
  Quote,
  ScreenCompare,
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
  ImageFigure,
  MapFigure,
  Mark,
  Pair,
  Quote,
  ScreenCompare,
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
