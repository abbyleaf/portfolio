"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  loadApplications,
  lockTracker,
  saveApplications,
  unlockTracker,
  type UnlockState,
} from "@/app/jobtracker/actions";
import { STATUSES, cleanApplications, type Application, type Status } from "@/lib/tracker-types";

const STALE_DAYS = 7;
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
  rejected: "bg-surface-accent-warm text-text-accent-warm",
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

/* ---------- styles (tokens only) ---------- */

const field =
  "h-item-40 w-full min-w-0 border-(length:--stroke-hairline) border-border-strong bg-surface-raised px-item-12 font-sans text-paragraph-md text-text-primary";
const fieldLabel = "flex min-w-0 flex-col gap-item-8";
const fieldLabelText = "font-mono text-mono-marker uppercase text-text-muted";

/**
 * A dropdown with its own arrow. The browser's arrow sits against the edge and cannot be
 * padded, so the native one is hidden and this one is drawn 8px in from the right.
 */
function SelectBox({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute top-1/2 right-item-8 size-item-12 -translate-y-1/2 text-text-primary"
      >
        <path d="M2 4.25 6 8.25l4-4" />
      </svg>
    </div>
  );
}
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

type Phase = "loading" | "locked" | "ready" | "error";
type SaveState = "idle" | "saving" | "saved" | "error";

function PasswordForm({ onUnlocked }: { onUnlocked: () => void }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockTracker, {});
  useEffect(() => {
    if (state.unlocked) onUnlocked();
  }, [state.unlocked, onUnlocked]);
  return (
    <form action={action} className="flex max-w-width-520 flex-col gap-item-12 border-(length:--stroke-hairline) border-border-strong bg-surface-raised p-item-24">
      <p className="font-heading text-heading-fraunces-md text-text-primary">Password required</p>
      <label htmlFor="tracker-password" className="font-mono text-mono-marker uppercase text-text-muted">
        Password
      </label>
      <div className="flex flex-wrap gap-item-12">
        <input
          id="tracker-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "tracker-password-error" : undefined}
          className={`${field} max-w-full flex-1`}
        />
        <button type="submit" disabled={pending} className={`${solidButton} disabled:opacity-60`}>
          {pending ? "Checking…" : "Enter"}
        </button>
      </div>
      {state.error && (
        <p id="tracker-password-error" role="alert" className="font-sans text-label-sm text-text-accent-warm">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function JobTracker() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [apps, setApps] = useState<Application[]>([]);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState("");
  // Saves run one after another so an older save can never land after a newer one.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  function apply(result: Awaited<ReturnType<typeof loadApplications>>) {
    if (result.status === "ok") {
      setApps(result.apps);
      setPhase("ready");
    } else if (result.status === "locked") {
      setPhase("locked");
    } else {
      setLoadError(result.message);
      setPhase("error");
    }
  }
  function load() {
    setPhase("loading");
    loadApplications().then(apply);
  }
  useEffect(() => {
    let cancelled = false;
    loadApplications().then((result) => {
      if (!cancelled) apply(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Shows the change at once, then saves the whole list on the server. */
  function write(next: Application[]) {
    setApps(next);
    setSaveState("saving");
    queue.current = queue.current.then(() =>
      saveApplications(next).then((result) => {
        if (result.status === "ok") {
          setSaveState("saved");
        } else if (result.status === "locked") {
          setPhase("locked");
        } else {
          setSaveError(result.message);
          setSaveState("error");
        }
      }),
    );
  }

  if (phase === "loading") {
    return (
      <p className="font-mono text-mono-marker uppercase text-text-muted" role="status">
        Loading your applications…
      </p>
    );
  }
  if (phase === "locked") return <PasswordForm onUnlocked={load} />;
  if (phase === "error") {
    return (
      <div className="flex flex-col items-start gap-item-12" role="alert">
        <p className="font-sans text-paragraph-md text-text-accent-warm">{loadError}</p>
        <button type="button" className={outlineButton} onClick={load}>
          Try again
        </button>
      </div>
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
        const rows = cleanApplications(JSON.parse(text));
        if (!rows) throw new Error("not a list");
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
          <SelectBox>
            <select
              className={`${field} appearance-none pr-item-32`}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABEL[s]}
                </option>
              ))}
            </select>
          </SelectBox>
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
                      <SelectBox className="inline-block">
                        <select
                          aria-label={`Status for ${a.company}`}
                          value={a.status}
                          onChange={(e) =>
                            update(a.id, { status: e.target.value as Status, updated: today })
                          }
                          className={`rounded-pill border-(length:--stroke-hairline) border-border-strong appearance-none py-item-6 pr-item-24 pl-item-12 font-mono text-mono-m uppercase ${STATUS_STYLE[a.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </SelectBox>
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
            <span role="status">
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                  ? "Saved."
                  : saveState === "error"
                    ? ""
                    : "Changes save automatically."}
            </span>{" "}
            A reminder appears after {STALE_DAYS} days without a status change or logged update.
          </p>
          <button
            type="button"
            className={smallButton}
            onClick={() => {
              lockTracker().then(() => setPhase("locked"));
            }}
          >
            Lock
          </button>
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
        {saveState === "error" && (
          <div role="alert" className="flex flex-wrap items-center gap-item-12">
            <p className="font-sans text-label-sm text-text-accent-warm">{saveError}</p>
            <button type="button" className={smallButton} onClick={() => write(apps)}>
              Try again
            </button>
          </div>
        )}
        {importError && (
          <p role="alert" className="font-sans text-label-sm text-text-accent-warm">
            {importError}
          </p>
        )}
      </div>
    </div>
  );
}
