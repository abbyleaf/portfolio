/** Shared by the tracker page and its server actions. */

export type Status = "applied" | "interviewing" | "offer" | "rejected";

export type Application = {
  id: string;
  company: string;
  title: string;
  /** yyyy-mm-dd */
  date: string;
  contact: string;
  status: Status;
  /** yyyy-mm-dd of the last status change or logged follow-up. */
  updated: string;
};

export const STATUSES: Status[] = ["applied", "interviewing", "offer", "rejected"];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ROWS = 1000;
const MAX_TEXT = 120;

function text(value: unknown, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Keeps only well-formed rows, so a bad file or request can never put odd data in the store.
 * Returns null when the input is not a list at all.
 */
export function cleanApplications(input: unknown): Application[] | null {
  if (!Array.isArray(input)) return null;
  const rows: Application[] = [];
  for (const raw of input.slice(0, MAX_ROWS)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const company = text(r.company);
    const title = text(r.title);
    const date = text(r.date, 10);
    const status = STATUSES.find((s) => s === r.status);
    if (!company || !title || !DATE.test(date) || !status) continue;
    const updated = text(r.updated, 10);
    rows.push({
      id: text(r.id, 64) || crypto.randomUUID(),
      company,
      title,
      date,
      contact: text(r.contact),
      status,
      updated: DATE.test(updated) ? updated : date,
    });
  }
  return rows;
}
