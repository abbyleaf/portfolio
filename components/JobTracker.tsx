"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";

type Status = "applied" | "interviewing" | "offer" | "rejected";

type Application = {
  id: string;
  company: string;
  title: string;
  /** yyyy-mm-dd */
  date: string;
  contact: string;
  status: Status;
  /** yyyy-mm-dd of the last status change or logged follow-up. */
  updated: string;
  sample?: boolean;
};

const STORAGE_KEY = "jobTracker.v1";
const SEEDED_KEY = "jobTracker.v1.seeded";
const STALE_DAYS = 7;
const STATUSES: Status[] = ["applied", "interviewing", "offer", "rejected"];
const LABEL: Record<Status, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};
const STATUS_STYLE: Record<Status, string> = {
  applied: "bg-surface-light-accent-cool text-text-info",
  interviewing: "bg-surface-warning text-text-warning",
  offer: "bg-green-500/25 text-text-primary",
  rejected: "bg-surface-info text-text-muted",
};

/* ---------- dates ---------- */

function iso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function dayNumber(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}
function daysBetween(from: string, to: string) {
  return dayNumber(to) - dayNumber(from);
}
function formatDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function ago(n: number) {
  return n <= 0 ? "today" : n === 1 ? "1 day ago" : `${n} days ago`;
}

/* ---------- storage (browser only, so it is read with useSyncExternalStore) ---------- */

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function seedOnce() {
  try {
    if (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(SEEDED_KEY)) return;
    const back = (n: number) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return iso(d);
    };
    const samples: Application[] = [
      {
        id: "sample-1",
        company: "Example Co",
        title: "Product Designer",
        date: back(12),
        contact: "Jordan Lee",
        status: "applied",
        updated: back(9),
        sample: true,
      },
      {
        id: "sample-2",
        company: "Sample Studio",
        title: "UX Researcher",
        date: back(5),
        contact: "Sam Rivera",
        status: "interviewing",
        updated: back(2),
        sample: true,
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {}
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  seedOnce();
  emit();
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}
function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
function getServerSnapshot() {
  return null;
}
function write(apps: Application[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {}
  emit();
}
function parse(raw: string): Application[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/* ---------- styles (tokens only) ---------- */

const field =
  "h-item-40 w-full min-w-0 border-(length:--stroke-hairline) border-border-strong bg-surface-raised px-item-12 font-sans text-paragraph-md text-text-primary";
const fieldLabel = "flex min-w-0 flex-col gap-item-8";
const fieldLabelText = "font-mono text-mono-marker uppercase text-text-muted";
const solidButton =
  "flex h-item-40 items-center justify-center bg-surface-inverted px-item-24 font-sans text-label-link text-text-on-inverted transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover";
const outlineButton =
  "flex h-item-40 items-center justify-center border-(length:--stroke-hairline) border-border-strong bg-surface-primary px-item-24 font-sans text-label-link text-text-primary transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover";
const smallButton =
  "border-(length:--stroke-hairline) border-border-strong bg-surface-primary px-item-10 py-item-6 font-sans text-label-caption text-text-primary hover:bg-surface-canvas";

/* ---------- component ---------- */

type FormState = {
  company: string;
  title: string;
  date: string;
  contact: string;
  status: Status;
};
const emptyForm = (): FormState => ({
  company: "",
  title: "",
  date: "",
  contact: "",
  status: "applied",
});

export function JobTracker() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const apps = useMemo(() => (raw === null ? null : parse(raw)), [raw]);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState("");

  if (apps === null) {
    return (
      <p className="font-mono text-mono-marker uppercase text-text-muted" role="status">
        Loading your applications…
      </p>
    );
  }

  const list: Application[] = apps;
  const today = iso(new Date());
  const stale = apps
    .filter((a) => a.status !== "rejected" && daysBetween(a.updated, today) >= STALE_DAYS)
    .sort((a, b) => (a.updated < b.updated ? -1 : 1));
  const visible = apps
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const count = (s: Status) => apps.filter((a) => a.status === s).length;

  const update = (id: string, patch: Partial<Application>) =>
    write(apps.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const logUpdate = (id: string) => update(id, { updated: today });

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const data = {
      company: form.company.trim(),
      title: form.title.trim(),
      date: form.date,
      contact: form.contact.trim(),
      status: form.status,
    };
    if (!data.company || !data.title || !data.date) return;
    if (editingId) {
      const current = list.find((a) => a.id === editingId);
      update(editingId, {
        ...data,
        sample: false,
        updated: current && current.status !== data.status ? today : current?.updated,
      });
    } else {
      write([...list, { ...data, id: crypto.randomUUID(), updated: today }]);
    }
    resetForm();
  }

  function startEdit(a: Application) {
    setEditingId(a.id);
    setForm({ company: a.company, title: a.title, date: a.date, contact: a.contact, status: a.status });
    document.getElementById("tracker-company")?.focus();
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "job-applications.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function importBackup(file: File | undefined) {
    if (!file) return;
    setImportError("");
    file
      .text()
      .then((text) => {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("not a list");
        const rows: Application[] = data
          .filter(
            (x) => x && x.company && x.title && x.date && STATUSES.includes(x.status),
          )
          .map((x) => ({ ...x, id: x.id ?? crypto.randomUUID(), updated: x.updated ?? x.date }));
        write(rows);
      })
      .catch(() => setImportError("That file isn't a backup from this tracker."));
  }

  return (
    <div className="flex flex-col gap-item-40">
      {stale.length > 0 && (
        <div
          role="status"
          className="flex rotate-(--rotate-tilt-left) flex-col gap-item-12 border-(length:--stroke-sticker) border-border-strong bg-surface-warning p-item-20 shadow-sticker max-md:rotate-0"
        >
          <p className="font-heading text-heading-fraunces-md text-text-primary">
            {stale.length === 1
              ? "1 application has"
              : `${stale.length} applications have`}{" "}
            had no update for {STALE_DAYS}+ days
          </p>
          <ul className="flex flex-col gap-item-8">
            {stale.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-item-10"
              >
                <span className="min-w-0 font-sans text-paragraph-md text-text-body">
                  <strong className="font-semibold text-text-primary">{a.company}</strong>
                  {" · "}
                  {a.title}
                  {a.contact && ` · contact: ${a.contact}`}
                  {" · "}
                  last update {ago(daysBetween(a.updated, today))}
                </span>
                <button type="button" className={smallButton} onClick={() => logUpdate(a.id)}>
                  Log follow-up
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={submit}
        className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] items-end gap-item-16 border-(length:--stroke-hairline) border-border-strong bg-surface-raised p-item-24"
      >
        <label className={fieldLabel}>
          <span className={fieldLabelText}>Company</span>
          <input
            id="tracker-company"
            className={field}
            required
            autoComplete="off"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={fieldLabelText}>Job title</span>
          <input
            className={field}
            required
            autoComplete="off"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={fieldLabelText}>Date applied</span>
          <input
            className={field}
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={fieldLabelText}>Contact name</span>
          <input
            className={field}
            autoComplete="off"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={fieldLabelText}>Status</span>
          <select
            className={field}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-item-8">
          <button type="submit" className={solidButton}>
            {editingId ? "Save changes" : "Add role"}
          </button>
          {editingId && (
            <button type="button" className={outlineButton} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-item-16">
        <div className="flex flex-wrap items-center justify-between gap-item-12">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-item-8">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={filter === s}
                onClick={() => setFilter(s)}
                className={`rounded-pill border-(length:--stroke-hairline) border-border-strong px-item-16 py-item-9 font-mono text-mono-m uppercase ${
                  filter === s
                    ? "bg-surface-inverted text-text-on-inverted"
                    : "bg-surface-primary text-text-primary hover:bg-surface-canvas"
                }`}
              >
                {s === "all" ? "All" : LABEL[s]} {s === "all" ? apps.length : count(s)}
              </button>
            ))}
          </div>
          <p className="font-mono text-mono-marker uppercase text-text-muted">
            {count("interviewing")} interviewing · {count("offer")} offers
          </p>
        </div>

        <div className="overflow-x-auto border-(length:--stroke-hairline) border-border-strong bg-surface-raised">
          <table className="w-full min-w-width-780 border-collapse text-left">
            <thead>
              <tr className="border-b-(length:--stroke-hairline) border-border-strong">
                {["Company", "Role", "Applied", "Contact", "Status", "Last update", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-item-16 py-item-12 font-mono text-mono-marker font-normal uppercase text-text-muted"
                    >
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => {
                const age = daysBetween(a.updated, today);
                const isStale = a.status !== "rejected" && age >= STALE_DAYS;
                return (
                  <tr key={a.id} className="border-b-(length:--stroke-hairline) border-border-subtle last:border-b-0">
                    <td className="px-item-16 py-item-12 font-heading text-heading-fraunces-md text-text-primary">
                      {a.company}
                      {a.sample && (
                        <span className="ml-item-8 font-mono text-stamp-xs uppercase tracking-(--tracking-caption) text-text-muted">
                          Sample
                        </span>
                      )}
                    </td>
                    <td className="px-item-16 py-item-12 font-sans text-paragraph-md text-text-body">
                      {a.title}
                    </td>
                    <td className="whitespace-nowrap px-item-16 py-item-12 font-mono text-mono-l text-text-body">
                      {formatDate(a.date)}
                    </td>
                    <td className="px-item-16 py-item-12 font-sans text-paragraph-md text-text-body">
                      {a.contact || "—"}
                    </td>
                    <td className="px-item-16 py-item-12">
                      <select
                        aria-label={`Status for ${a.company}`}
                        value={a.status}
                        onChange={(e) =>
                          update(a.id, { status: e.target.value as Status, updated: today })
                        }
                        className={`rounded-pill border-(length:--stroke-hairline) border-border-strong px-item-12 py-item-6 font-mono text-mono-m uppercase ${STATUS_STYLE[a.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-item-16 py-item-12 font-mono text-mono-l text-text-body">
                      {ago(age)}
                      {isStale && (
                        <span className="ml-item-8 inline-block rotate-(--rotate-tilt-right) border-(length:--stroke-hairline) border-border-strong bg-surface-warning px-item-8 py-item-3 font-mono text-stamp-xs uppercase tracking-(--tracking-caption) text-text-warning">
                          Follow up
                        </span>
                      )}
                    </td>
                    <td className="px-item-16 py-item-12">
                      <div className="flex justify-end gap-item-6">
                        {confirmId === a.id ? (
                          <>
                            <button
                              type="button"
                              className="bg-surface-inverted px-item-10 py-item-6 font-sans text-label-caption text-text-on-inverted"
                              onClick={() => {
                                write(apps.filter((x) => x.id !== a.id));
                                setConfirmId(null);
                              }}
                            >
                              Confirm delete
                            </button>
                            <button type="button" className={smallButton} onClick={() => setConfirmId(null)}>
                              Keep
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={smallButton}
                              title="Reset the 7-day clock"
                              onClick={() => logUpdate(a.id)}
                            >
                              Log update
                            </button>
                            <button type="button" className={smallButton} onClick={() => startEdit(a)}>
                              Edit
                            </button>
                            <button type="button" className={smallButton} onClick={() => setConfirmId(a.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="p-item-32 text-center font-sans text-paragraph-md text-text-muted">
              {apps.length === 0
                ? "No roles yet. Add your first application above."
                : "No roles with this status."}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-item-12">
          <p className="min-w-0 flex-1 font-sans text-label-sm text-text-muted">
            Saved in this browser only. A reminder appears after {STALE_DAYS} days without a
            status change or logged update.
          </p>
          <button type="button" className={smallButton} onClick={exportBackup}>
            Export backup
          </button>
          <label className={`${smallButton} cursor-pointer focus-within:outline-(length:--stroke-sticker) focus-within:outline-azure-55`}>
            Import backup
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => {
                importBackup(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {importError && (
          <p role="alert" className="font-sans text-label-sm text-text-accent-warm">
            {importError}
          </p>
        )}
      </div>
    </div>
  );
}
