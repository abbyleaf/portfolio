export const heroPhrases = [
  "loosely defined problems",
  "everyday workflows",
  "complex product rules",
];

export const designStrengths = [
  "Workflow design",
  "Product thinking",
  "Interaction design",
  "Systems thinking",
  "User research",
  "UI design",
  "Prototyping",
];

export const howIWork = [
  "Problem framing",
  "Workflow mapping",
  "Usability testing",
  "Design iteration",
  "Information hierarchy",
  "Scope decisions",
];

export const currently = [
  { label: "Currently", value: "Open to work" },
  { label: "Previously", value: "Senior Product Designer @ SWAT Mobility" },
  { label: "Off-screen", value: "Paper craft, collecting stamps and stickers" },
];

export type CaseStudySummary = {
  slug: string;
  number: string;
  year: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  /** Listed on the Work page but not written up yet, so it has no page to link to. */
  comingSoon?: boolean;
};

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "campus-ride-booking",
    comingSoon: true,
    number: "01",
    year: "2026",
    category: "Passenger transport · mobile app",
    title: "Bringing shuttle and on-demand rides together",
    summary:
      "Integrated a fixed-route shuttle service into an existing university ride app. Over 80% of dormitory students who used the shuttle took another ride, while over 85% of shuttle journeys started or ended at the dormitory.",
    tags: [
      "Product Thinking",
      "Product Evolution",
      "AI Tools",
      "Data-informed Design",
    ],
  },
  {
    slug: "order-splitting",
    comingSoon: true,
    number: "02",
    year: "2026",
    category: "Logistics · web",
    title: "Helping planners split orders across vehicles",
    summary:
      "Redesigned how transport planners split orders across vehicles based on available capacity, with the aim of supporting 25+ planners handling 2,000 to 3,000 orders daily.",
    tags: [
      "Workflow Research",
      "Product Framing",
      "AI Tools",
      "Prototyping",
    ],
  },
  {
    slug: "manual-route-planning",
    comingSoon: true,
    number: "03",
    year: "2025",
    category: "Logistics · web",
    title: "Giving planners control over automated routes",
    summary:
      "Designed manual planning and violation review features that gave transport planners control over automated routes. Shipped as part of a logistics platform supporting 30+ planners and a median of 11,000 orders daily.",
    tags: [
      "Product Thinking",
      "User Research",
      "Interaction Design",
      "Prototyping",
    ],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  tone: "canvas" | "warm" | "cool";
  tilt: "none" | "left" | "right";
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "One of her strengths is always asking ‘why’ before jumping into a solution.",
    name: "Kevin",
    role: "Product manager",
    tone: "canvas",
    tilt: "left",
  },
  {
    quote:
      "Abigail pays close attention to the finer points of an interface, from spacing and alignment to visual consistency.",
    name: "Valerie",
    role: "Design team lead",
    tone: "warm",
    tilt: "none",
  },
  {
    quote:
      "She'll rework it to make implementation easier without losing what made the design good in the first place.",
    name: "Shaina",
    role: "QA engineer",
    tone: "cool",
    tilt: "right",
  },
  {
    quote:
      "Abigail has a strong ability to understand complex problems and translate them into thoughtful, intuitive user experiences.",
    name: "Darren",
    role: "Product manager",
    tone: "canvas",
    tilt: "left",
  },
  {
    quote:
      "She was extremely organised, especially with file management and keeping design work structured and easy to follow.",
    name: "Melvin",
    role: "Product designer",
    tone: "warm",
    tilt: "right",
  },
  {
    quote:
      "Abigail would take the time to understand the market, research competitors, and look at how similar products approached the problem.",
    name: "Oleg",
    role: "Lead mobile developer",
    tone: "cool",
    tilt: "none",
  },
  {
    quote:
      "She cared deeply about the final product, regularly testing the UI and documenting bugs clearly so issues could be resolved early.",
    name: "Fernando",
    role: "Senior QA engineer",
    tone: "canvas",
    tilt: "left",
  },
  {
    quote:
      "Abigail was always my go-to person for constructive critique, and our conversations about flows and edge cases pushed me to think more carefully as a designer...",
    name: "Callie",
    role: "Product designer",
    tone: "warm",
    tilt: "right",
  },
];

export const footerLinks = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abigailyeap/" },
  { label: "Email", href: "mailto:abigailyeap@gmail.com" },
];
