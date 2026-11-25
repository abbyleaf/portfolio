import { promises as fs } from "node:fs";
import path from "node:path";
import { cleanApplications, type Application } from "./tracker-types";

/*
 * Where the tracker's roles are kept. On Vercel that is the Upstash Redis database from the
 * Storage tab, reached over its REST API (the variables Vercel adds are read below). On a
 * developer machine without those variables, a git-ignored JSON file stands in, so the page
 * can be tried locally. In production with no database set up, saving fails loudly instead.
 */

const KEY = "jobtracker:applications";
const LOCAL_FILE = path.join(process.cwd(), ".tracker-data.json");

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(command: string[]) {
  const config = redisConfig()!;
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database request failed (${response.status})`);
  const body = (await response.json()) as { result?: unknown; error?: string };
  if (body.error) throw new Error(body.error);
  return body.result;
}

/** Development, or an explicit TRACKER_LOCAL_FILE=true (for trying a production build locally). */
function canUseLocalFile() {
  return process.env.NODE_ENV !== "production" || process.env.TRACKER_LOCAL_FILE === "true";
}

export function storageIsConfigured() {
  return redisConfig() !== null || canUseLocalFile();
}

export async function readApplications(): Promise<Application[]> {
  if (redisConfig()) {
    const result = await redis(["GET", KEY]);
    if (typeof result !== "string") return [];
    return cleanApplications(JSON.parse(result)) ?? [];
  }
  if (!canUseLocalFile()) throw new Error("Storage is not set up.");
  try {
    return cleanApplications(JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"))) ?? [];
  } catch {
    return [];
  }
}

export async function writeApplications(apps: Application[]): Promise<void> {
  if (redisConfig()) {
    await redis(["SET", KEY, JSON.stringify(apps)]);
    return;
  }
  if (!canUseLocalFile()) throw new Error("Storage is not set up.");
  await fs.writeFile(LOCAL_FILE, JSON.stringify(apps, null, 2));
}
