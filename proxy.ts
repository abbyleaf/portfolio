import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { comingSoonOnLiveSite } from "@/content/site";

/**
 * Coming-soon mode. On the live site (Vercel's production environment) every page shows
 * /coming-soon, and pictures, videos and the resume return 404, while `comingSoonOnLiveSite`
 * in content/site.ts is true. Preview deployments (test, staging) are unaffected. Set
 * COMING_SOON=true to try it locally. The code is the same on every branch.
 */
function comingSoonOn() {
  if (process.env.COMING_SOON === "true") return true;
  return process.env.VERCEL_ENV === "production" && comingSoonOnLiveSite;
}

const HIDDEN_FILES = ["/images", "/videos", "/resume.pdf", "/_next/image"];

export function proxy(request: NextRequest) {
  if (!comingSoonOn()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (HIDDEN_FILES.some((prefix) => pathname.startsWith(prefix))) {
    return new NextResponse(null, { status: 404 });
  }
  if (pathname === "/coming-soon") return NextResponse.next();
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  // Everything except the built CSS, JS and fonts the page itself needs, and the favicon.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
