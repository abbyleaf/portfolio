"use server";

import { cookies } from "next/headers";
import {
  TRACKER_COOKIE,
  TRACKER_MAX_AGE,
  hasTrackerAccess,
  trackerPasswordMatches,
  trackerToken,
} from "@/lib/tracker-access";
import {
  readApplications,
  storageDiagnosis,
  storageIsConfigured,
  writeApplications,
} from "@/lib/tracker-store";
import { cleanApplications, type Application } from "@/lib/tracker-types";

export type UnlockState = { error?: string; unlocked?: boolean };
export type LoadResult =
  | { status: "locked" }
  | { status: "ok"; apps: Application[] }
  | { status: "error"; message: string };
export type SaveResult = { status: "ok" } | { status: "locked" } | { status: "error"; message: string };

async function allowed() {
  return hasTrackerAccess((await cookies()).get(TRACKER_COOKIE)?.value);
}

/** Checks the password on the server and, if it is right, unlocks the tracker for 30 days. */
export async function unlockTracker(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = process.env.TRACKER_PW;
  if (!password) return { error: "The tracker's password is not set up yet." };
  const typed = formData.get("password");
  if (typeof typed !== "string" || !(await trackerPasswordMatches(typed))) {
    // A short pause makes guessing slower.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: "That password is not right. Please try again." };
  }
  (await cookies()).set(TRACKER_COOKIE, await trackerToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TRACKER_MAX_AGE,
  });
  return { unlocked: true };
}

export async function lockTracker(): Promise<void> {
  (await cookies()).delete(TRACKER_COOKIE);
}

export async function loadApplications(): Promise<LoadResult> {
  if (!(await allowed())) return { status: "locked" };
  if (!storageIsConfigured()) {
    return {
      status: "error",
      message: `Storage is not set up for this site yet (${storageDiagnosis()}).`,
    };
  }
  try {
    return { status: "ok", apps: await readApplications() };
  } catch {
    return { status: "error", message: "Could not load your applications." };
  }
}

export async function saveApplications(input: unknown): Promise<SaveResult> {
  if (!(await allowed())) return { status: "locked" };
  const apps = cleanApplications(input);
  if (!apps) return { status: "error", message: "Nothing to save." };
  try {
    await writeApplications(apps);
    return { status: "ok" };
  } catch {
    return { status: "error", message: "Could not save. Your last change is not stored yet." };
  }
}
