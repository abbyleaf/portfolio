import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Google serves Inter without the diagonal arrows (↗ etc.), so the browser would
// draw them from a system font. This is Inter's own arrow block, subset from the
// OFL font, and unicode-range keeps it from touching any other character.
const interArrows = localFont({
  src: "./fonts/inter-arrows.woff2",
  variable: "--font-inter-arrows",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-2199" }],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies and craft.",
  // Light and dark tabs get different SVGs; the .ico is for browsers without SVG favicons.
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "48x48" },
      {
        url: "/icons/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/icons/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${interArrows.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
