export const personalInterests = [
  "Bubble tea",
  "Stickers",
  "Stamps",
  "Crafts",
  "Art fairs",
  "Korean food",
  "Sci-fi movies",
  "Interactive galleries",
];

export type Job = {
  title: string;
  company: string;
  summary: string;
  period: string;
};

export const experience: Job[] = [
  {
    title: "Senior Product Designer",
    company: "SWAT Mobility",
    summary:
      "Designed and owned features across passenger transport and logistics products in Southeast Asia and Japan",
    period: "2023 — 2026",
  },
  {
    title: "Product Designer",
    company: "SWAT Mobility",
    summary:
      "Designed passenger-facing booking experiences across three mobility product lines: Commute Pass, Digital Fixed Routes and On Demand.",
    period: "2020 — 2023",
  },
  {
    title: "Multimedia Designer",
    company: "Multimedia People",
    summary:
      "Delivered 12 interactive installations across Singapore City Gallery (URA), Centre for Ethnobotany Gallery, and Bihar Museum, India.",
    period: "2016 — 2019",
  },
];

export const skillGroups = [
  {
    label: "Design",
    skills: [
      "Product Design",
      "Interaction Design",
      "Design Systems",
      "Mobile & Web Design",
      "Prototyping",
      "UI Design",
      "Motion Design",
    ],
  },
  {
    label: "Research",
    skills: [
      "User Research",
      "User Flows",
      "Usability Testing",
      "Design Thinking",
      "Journey Maps",
      "Contextual Inquiry",
    ],
  },
  {
    label: "Collaboration",
    skills: ["Stakeholder Management", "Cross-functional Collaboration"],
  },
  {
    label: "Tools",
    skills: [
      "Figma",
      "FigJam",
      "Figma Make",
      "Claude Code",
      "v0 by Vercel",
      "Webflow",
      "Maze",
      "Notion",
      "Illustrator",
      "Photoshop",
      "After Effects",
    ],
  },
];
