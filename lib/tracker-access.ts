/*
 * Access to the job tracker. One password (TRACKER_PW, set in .env.local and in Vercel, never
 * in the code) unlocks it. A correct password sets a cookie holding an HMAC of a fixed phrase,
 * keyed with the password, so the cookie proves the password was known without containing it,
 * and changing the password signs everyone out. The phrase differs from the case study gate's,
 * so one gate's cookie never opens the other.
 */

export const TRACKER_COOKIE = "tracker-access";
/** How long an unlock lasts: 30 days. */
export const TRACKER_MAX_AGE = 60 * 60 * 24 * 30;

const PHRASE = "job-tracker-access:v1";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function trackerToken(password: string): Promise<string> {
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

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the cookie was issued for the current password. No password set means nobody gets in. */
export async function hasTrackerAccess(cookieValue: string | undefined): Promise<boolean> {
  const password = process.env.TRACKER_PW;
  if (!password || !cookieValue) return false;
  return sameString(cookieValue, await trackerToken(password));
}

/** True when what a visitor typed is the password. */
export async function trackerPasswordMatches(typed: string): Promise<boolean> {
  const password = process.env.TRACKER_PW;
  if (!password) return false;
  return sameString(await trackerToken(typed), await trackerToken(password));
}
