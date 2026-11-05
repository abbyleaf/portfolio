/*
 * Access to the full case studies. One password (CASE_STUDY_PASSWORD, set in .env.local and in
 * Vercel, never in the code) unlocks every study. A correct password sets a cookie holding
 * an HMAC of a fixed phrase, keyed with the password. The cookie therefore proves the
 * password was known without containing it, and changing the password signs everyone out.
 * Uses Web Crypto only, so it runs in the proxy and in server actions alike.
 */

export const ACCESS_COOKIE = "case-study-access";
/** How long an unlock lasts: 30 days. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30;

const PHRASE = "case-study-access:v1";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** The cookie value for a password. */
export async function accessToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(PHRASE)));
}

/** Compares two strings without stopping at the first difference. */
function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the cookie was issued for the current password. No password set means nobody gets in. */
export async function hasAccess(cookieValue: string | undefined): Promise<boolean> {
  const password = process.env.CASE_STUDY_PASSWORD;
  if (!password || !cookieValue) return false;
  return sameString(cookieValue, await accessToken(password));
}

/** True when what a visitor typed is the password. */
export async function passwordMatches(typed: string): Promise<boolean> {
  const password = process.env.CASE_STUDY_PASSWORD;
  if (!password) return false;
  return sameString(await accessToken(typed), await accessToken(password));
}

/** Where to send a visitor after unlocking: only case study pages, never another site. */
export function safeReturnPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/work";
  const ok = /^\/case-studies\/[a-z0-9-]+(#[a-z0-9-]*)?$/.test(value);
  return ok ? value : "/work";
}
