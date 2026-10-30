import { caseStudies, type CaseStudySummary } from "./home";

export const workStudies: CaseStudySummary[] = [
  ...caseStudies,
  {
    slug: "problem-framing",
    number: "04",
    year: "2026",
    category: "Product thinking · AI tools",
    title: "Making the problem clear before designing the solution",
    summary: "This case study is still being written.",
    tags: [
      "Product Thinking",
      "User Research",
      "Interaction Design",
      "Prototyping",
    ],
    comingSoon: true,
  },
  {
    slug: "delivery-plan-editing",
    number: "05",
    year: "2025",
    category: "Logistics · web",
    title: "Editing order and trip details without leaving the delivery plan",
    summary: "This case study is still being written.",
    tags: [
      "Product Thinking",
      "User Research",
      "Interaction Design",
      "Prototyping",
    ],
    comingSoon: true,
  },
];
