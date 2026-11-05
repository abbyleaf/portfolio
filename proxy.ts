import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { comingSoonOnLiveSite } from "@/content/site";
import { ACCESS_COOKIE, hasAccess } from "@/lib/case-access";

/**
 * Coming-soon mode. On the live site (Vercel's production environment) every page shows
 * /coming-soon, and pictures, videos and the resume return 404, while `comingSoonOnLiveSite`
 * in content/site.ts is true. Preview deployments (test, staging) are unaffected. Set
 * COMING_SOON=true to try it locally. The code is the same on every branch.
 *
 * It also holds the case study password gate (see lib/case-access.ts).
 */
function comingSoonOn() {
  if (process.env.COMING_SOON === "true") return true;
  return process.env.VERCEL_ENV === "production" && comingSoonOnLiveSite;
}

const HIDDEN_FILES = ["/images", "/videos", "/resume.pdf", "/_next/image"];

/** A case study page: /case-studies/<slug>. */
const CASE_STUDY_PAGE = /^\/case-studies\/([a-z0-9-]+)\/?$/;
/** Pictures and videos kept in a `locked` folder are only for visitors with the password. */
const LOCKED_FILE = /^\/(images|videos)\/case-studies\/[^/]+\/locked\//;

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (comingSoonOn()) {
    if (HIDDEN_FILES.some((prefix) => pathname.startsWith(prefix))) {
      return new NextResponse(null, { status: 404 });
    }
    if (pathname === "/coming-soon") return NextResponse.next();
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  // Password gate: without the cookie, a case study page becomes its locked version, and
  // files in a `locked` folder (also reached through the image optimiser) are not found.
  const page = CASE_STUDY_PAGE.exec(pathname);
  const lockedFile =
    LOCKED_FILE.test(pathname) ||
    (pathname.startsWith("/_next/image") && LOCKED_FILE.test(searchParams.get("url") ?? ""));
  if (page || lockedFile) {
    const allowed = await hasAccess(request.cookies.get(ACCESS_COOKIE)?.value);
    if (!allowed) {
      if (lockedFile) return new NextResponse(null, { status: 404 });
      return NextResponse.rewrite(new URL(`/case-studies/${page![1]}/locked`, request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Everything except the built CSS, JS and fonts the page itself needs, and the favicons.
  matcher: ["/((?!_next/static|icons/).*)"],
};
