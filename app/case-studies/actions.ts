"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  accessToken,
  passwordMatches,
  safeReturnPath,
} from "@/lib/case-access";

export type UnlockState = { error?: string };

/** Checks the password on the server and, if it is right, unlocks every case study. */
export async function unlock(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = process.env.CASE_STUDY_PASSWORD;
  if (!password) {
    return { error: "Access is not set up yet. Please contact me." };
  }
  const typed = formData.get("password");
  if (typeof typed !== "string" || !(await passwordMatches(typed))) {
    // A short pause makes guessing slower.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: "That password is not right. Please try again." };
  }
  (await cookies()).set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  redirect(safeReturnPath(formData.get("next")));
}
