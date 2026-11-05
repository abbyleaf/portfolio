"use client";

import { usePathname } from "next/navigation";
import { useActionState, type MouseEvent } from "react";
import { unlock, type UnlockState } from "@/app/case-studies/actions";

/** Id of the box, so the contents rail and the ruler can jump to it. */
export const GATE_ID = "password";
export const GATE_INPUT_ID = "password-input";

/**
 * Stands in for the locked part of a case study (see `Locked` in mdx-components.tsx). The
 * password is checked on the server by `unlock`; nothing about it is in this file. After a
 * correct password the visitor lands on the section they asked for, or on `landOn` (the
 * first hidden section) when they came here without choosing one. A link to a hidden section
 * lands on this box, because `anchors` carries those ids.
 */
export function PasswordGate({
  landOn,
  anchors = [],
}: {
  landOn?: string;
  /** Ids of the hidden sections: a link to any of them lands on this box. */
  anchors?: string[];
}) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, {});
  const pathname = usePathname();
  // Read when the visitor presses Enter, so it is always the address they are looking at now.
  const setReturnPath = (event: MouseEvent<HTMLButtonElement>) => {
    const hash = window.location.hash;
    const target = hash && hash !== `#${GATE_ID}` ? hash : landOn ? `#${landOn}` : "";
    const field = event.currentTarget.form?.elements.namedItem("next");
    if (field instanceof HTMLInputElement) field.value = `${pathname}${target}`;
  };

  return (
    <>
      <div aria-hidden="true" className="py-item-56">
        <hr className="border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
      </div>
      {/* A link to a hidden section (#problem, say) has to land somewhere, so these stand in for it. */}
      {anchors.map((id) => (
        <span key={id} id={id} className="scroll-mt-item-20" />
      ))}
      <section
        id={GATE_ID}
        aria-labelledby="password-title"
        data-ruler-section="Password"
        className="flex scroll-mt-item-20 flex-col gap-item-20"
      >
        <header className="flex flex-col gap-item-12">
          <p className="font-sans text-heading-inter-sm uppercase text-text-sub-headers">
            Confidential work
          </p>
          <h2
            id="password-title"
            className="flex items-center gap-item-12 font-heading font-wonk text-heading-fraunces-xl text-text-primary"
          >
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
            >
              <path d="M12 1.5a5 5 0 0 0-5 5V9H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6.5a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0V9H9V6.5Zm3 7a1.75 1.75 0 0 1 1 3.2V18.5a1 1 0 0 1-2 0v-1.8a1.75 1.75 0 0 1 1-3.2Z" />
            </svg>
            Password required
          </h2>
        </header>
        <p className="border-l-(length:--stroke-sticker) border-red-200 pl-item-20 font-heading font-wonk text-heading-fraunces-md font-normal italic text-text-accent-warm">
          The rest of this case study is available on request. Please contact me for access.
        </p>
        <form action={action} className="flex flex-col gap-item-8">
          <input type="hidden" name="next" defaultValue={pathname} />
          <label htmlFor={GATE_INPUT_ID} className="font-sans text-label-sm text-text-primary">
            Password
          </label>
          <div className="flex flex-wrap gap-item-16">
            <input
              id={GATE_INPUT_ID}
              name="password"
              type="password"
              required
              autoComplete="off"
              placeholder="Enter password"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={state.error ? "password-error" : undefined}
              className="h-item-48 w-item-320 max-w-full border-(length:--stroke-hairline) border-border-strong bg-surface-canvas px-item-16 font-sans text-label-md text-text-primary placeholder:text-text-muted"
            />
            <button
              type="submit"
              onClick={setReturnPath}
              disabled={pending}
              className="h-item-48 w-item-120 bg-surface-inverted font-sans text-label-md text-text-on-inverted transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover disabled:opacity-60"
            >
              {pending ? "Checking…" : "Enter"}
            </button>
          </div>
          {state.error && (
            <p id="password-error" role="alert" className="font-sans text-label-sm text-text-accent-warm">
              {state.error}
            </p>
          )}
        </form>
      </section>
    </>
  );
}
