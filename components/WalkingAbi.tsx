"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AbiFront, AbiWalkRig } from "./AbiArt";
import "./WalkingAbi.css";

/*
 * Abi walks along the copyright hairline at the bottom of the footer (see SiteFooter).
 * Desktop: she walks back and forth, pausing under each column label with a speech bubble.
 * Below md: she walks in from off-screen, stops near the centre, says one line, walks off the
 * other side and comes back with the next line. Clicking her makes her wave and say hi.
 * Her position moves through a ref, so React only re-renders when her pose or bubble changes.
 */

/** Her box: 88 × 226, the svg's 140 × 360 view box at 88/140 scale. */
const FIG = 88;
/**
 * Matched to her stride: the planted foot travels about 105 rig units per half cycle (0.5s)
 * at 88/140 scale, so moving at this speed keeps it from sliding.
 */
const SPEED = 132;
const STOP_MS = 2600;
const MOBILE_STOP_MS = 2800;
const OFFSTAGE_MS = 1400;
const HI_MS = 2400;
/** On a phone, how far past the screen edge she walks before turning back. */
const OFFSTAGE = 24;
/** On a phone, the bubble's centre stays at least this far from either screen edge. */
const BUBBLE_EDGE = 140;
/** On desktop, the bubble moves to her left once she is this close to the lane's right end. */
const FLIP_ZONE = 352;

const HI = "Oh, hi there!\nLet’s connect!";

/**
 * Her stops on desktop, one per footer column, in the same order as the labels marked
 * `data-abi-stop` in SiteFooter. `offset` is where she stops relative to that label's left
 * edge (tuned on a 1312px lane, where the stops fall at 115, 635 and 1050).
 */
const STOPS = [
  { text: "Work with me ↑", offset: 115 },
  { text: "My info, up here ↑", offset: -21 },
  { text: "Pick a case study ↑", offset: 46 },
];

type Bubble = { text: string; side: "right" | "left" | "above"; left: number };
type View = { walking: boolean; dir: 1 | -1; excited: boolean; bubble: Bubble | null };

const WALKING: View = { walking: true, dir: 1, excited: false, bubble: null };

export function WalkingAbi() {
  const lane = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(WALKING);
  const [paused, setPaused] = useState(false);
  // Everything the animation loop needs, kept out of React state.
  const sim = useRef({
    x: 0,
    dir: 1 as 1 | -1,
    pauseUntil: 0,
    mobile: false,
    reduced: false,
    phase: "in" as "in" | "out" | "gone",
    line: 0,
    /** Where she stops on desktop, in lane coordinates. */
    stops: [] as { at: number; text: string }[],
    width: 0,
    /** The lane's distance from each side of the screen, for walking off-screen on a phone. */
    edgeLeft: 0,
    edgeRight: 0,
    viewport: 0,
    reducedTimer: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const place = useCallback(() => {
    const el = figure.current;
    if (!el) return;
    el.style.transform = `translateX(${Math.round(sim.current.x)}px)`;
    // She starts hidden, so she never flashes at the lane's left end before being placed.
    el.style.visibility = "visible";
  }, []);

  /** The bubble beside or above her, for where she is standing now. */
  const bubbleFor = useCallback((text: string): Bubble => {
    const s = sim.current;
    if (s.mobile) {
      const centre = s.edgeLeft + s.x + FIG / 2;
      const clamped = Math.max(BUBBLE_EDGE, Math.min(s.viewport - BUBBLE_EDGE, centre));
      return { text, side: "above", left: Math.round(FIG / 2 + (clamped - centre)) };
    }
    return { text, side: s.x < s.width - FLIP_ZONE ? "right" : "left", left: 0 };
  }, []);

  /** Measures the lane and, on desktop, where each column label sits. */
  const measure = useCallback(() => {
    const el = lane.current;
    if (!el) return;
    const s = sim.current;
    const box = el.getBoundingClientRect();
    s.width = box.width;
    s.viewport = document.documentElement.clientWidth;
    s.edgeLeft = box.left;
    s.edgeRight = s.viewport - box.right;
    const footer = el.closest("footer");
    const labels = footer ? [...footer.querySelectorAll<HTMLElement>("[data-abi-stop]")] : [];
    s.stops = labels.map((label, i) => ({
      at: Math.max(0, Math.min(s.width - FIG, label.getBoundingClientRect().left - box.left + STOPS[i].offset)),
      text: STOPS[i].text,
    }));
  }, []);

  /** Stands her still, facing front, under "Work with me" (or centred on a phone). */
  const standStill = useCallback(() => {
    const s = sim.current;
    const first = s.stops[0];
    s.x = s.mobile ? (s.width - FIG) / 2 : (first?.at ?? 0);
    place();
    setView({ walking: false, dir: 1, excited: false, bubble: bubbleFor(STOPS[0].text) });
  }, [bubbleFor, place]);

  /** Starts over for the current screen size. */
  const reset = useCallback(() => {
    const s = sim.current;
    s.mobile = !window.matchMedia("(min-width: 48rem)").matches;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    s.pauseUntil = 0;
    s.dir = 1;
    s.phase = "in";
    s.line = 0;
    if (s.reduced) return standStill();
    s.x = s.mobile ? -s.edgeLeft - FIG - OFFSTAGE : 0;
    place();
    setView(WALKING);
  }, [measure, place, standStill]);

  // Set up once, and again when the screen crosses the md breakpoint or motion settings change.
  useEffect(() => {
    reset();
    const md = window.matchMedia("(min-width: 48rem)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    md.addEventListener("change", reset);
    motion.addEventListener("change", reset);
    const resize = new ResizeObserver(() => {
      measure();
      const s = sim.current;
      if (s.reduced) standStill();
      else if (!s.mobile) {
        s.x = Math.min(s.x, s.width - FIG);
        place();
      }
    });
    if (lane.current) resize.observe(lane.current);
    const s = sim.current;
    return () => {
      md.removeEventListener("change", reset);
      motion.removeEventListener("change", reset);
      resize.disconnect();
      clearTimeout(s.reducedTimer);
    };
  }, [measure, place, reset, standStill]);

  // Run only while the footer is on screen and the tab is visible.
  useEffect(() => {
    const el = lane.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setPaused(!onScreen || document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // The walk loop.
  useEffect(() => {
    if (paused || sim.current.reduced) return;
    let raf = 0;
    let last = 0;
    const s = sim.current;

    const stand = (text: string, ms: number, t: number) => {
      s.pauseUntil = t + ms;
      setView({ walking: false, dir: s.dir, excited: false, bubble: bubbleFor(text) });
    };
    const walk = () => setView((v) => (v.walking && v.dir === s.dir ? v : { ...WALKING, dir: s.dir }));

    const tickDesktop = (t: number, dt: number) => {
      const maxX = s.width - FIG;
      const x = s.x;
      let nx = x + s.dir * SPEED * dt;
      if (nx >= maxX) {
        nx = maxX;
        s.dir = -1;
      }
      if (nx <= 0) {
        nx = 0;
        s.dir = 1;
      }
      const hit = s.stops.find((stop) => (x < stop.at && nx >= stop.at) || (x > stop.at && nx <= stop.at));
      s.x = hit ? hit.at : nx;
      place();
      if (hit) stand(hit.text, STOP_MS, t);
      else walk();
    };

    const tickMobile = (t: number, dt: number) => {
      const start = -s.edgeLeft - FIG - OFFSTAGE;
      const end = s.width + s.edgeRight + OFFSTAGE;
      if (s.phase === "gone") {
        // Off-screen: turn round and come back in from the other side with the next line.
        s.dir = s.dir > 0 ? -1 : 1;
        s.x = s.dir > 0 ? start : end;
        s.phase = "in";
        s.line = (s.line + 1) % STOPS.length;
      }
      const nx = s.x + s.dir * SPEED * dt;
      if (s.phase === "in") {
        // A little either side of centre, so passes don't look identical.
        const stop = (s.width - FIG) / 2 + (s.dir > 0 ? 18 : -18);
        if ((s.dir > 0 && nx >= stop) || (s.dir < 0 && nx <= stop)) {
          s.x = stop;
          s.phase = "out";
          place();
          stand(STOPS[s.line].text, MOBILE_STOP_MS, t);
          return;
        }
      }
      s.x = nx;
      place();
      if (s.phase === "out" && (nx > end || nx < start)) {
        s.phase = "gone";
        s.pauseUntil = t + OFFSTAGE_MS;
        return;
      }
      walk();
    };

    const tick = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (t >= s.pauseUntil) {
        if (s.mobile) tickMobile(t, dt);
        else tickDesktop(t, dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, bubbleFor, place]);

  function sayHi() {
    const s = sim.current;
    setView({ walking: false, dir: s.dir, excited: true, bubble: bubbleFor(HI) });
    if (s.reduced) {
      // No walking with reduced motion: go back to standing under "Work with me".
      clearTimeout(s.reducedTimer);
      s.reducedTimer = setTimeout(standStill, HI_MS);
    } else {
      s.pauseUntil = performance.now() + HI_MS;
    }
  }

  const { walking, dir, excited, bubble } = view;
  return (
    <div
      ref={lane}
      className={`pointer-events-none relative h-item-236 w-full max-w-width-1400 shrink-0 ${paused ? "abi-paused" : ""}`}
    >
      <div
        ref={figure}
        className={`absolute -bottom-(--stroke-hairline) left-0 h-item-226 w-item-88 invisible`}
      >
        <span
          aria-hidden="true"
          className="absolute -bottom-item-4 left-item-14 h-item-8 w-item-60 rounded-pill bg-grey-10/14"
        />
        <button
          type="button"
          onClick={sayHi}
          aria-label="Say hi to Abi"
          className="pointer-events-auto absolute inset-0 cursor-pointer"
        >
          {walking ? (
            <div className="size-full" style={{ transform: `scaleX(${dir})` }}>
              <svg
                className="abi-rig block overflow-visible"
                viewBox="0 -36 140 360"
                width={FIG}
                height={226}
                aria-hidden="true"
              >
                <AbiWalkRig />
              </svg>
            </div>
          ) : (
            <svg
              className={`abi-front ${excited ? "abi-excited" : ""} block overflow-visible`}
              viewBox="0 -36 140 360"
              width={FIG}
              height={226}
              aria-hidden="true"
            >
              <AbiFront />
            </svg>
          )}
        </button>
        {bubble && (
          <div
            className={`absolute ${
              bubble.side === "above"
                ? "bottom-full mb-item-4 -translate-x-1/2"
                : bubble.side === "right"
                  ? "-top-item-10 left-item-96"
                  : "-top-item-10 -left-item-8 -translate-x-full"
            }`}
            style={bubble.side === "above" ? { left: bubble.left } : undefined}
          >
            <p
              key={bubble.text}
              role="status"
              className={`abi-pop w-max rotate-(--rotate-bubble) whitespace-pre border-(length:--stroke-rule) border-grey-900 bg-surface-raised px-item-14 py-item-10 font-mono text-mono-bubble uppercase text-grey-900 shadow-bubble ${
                bubble.side === "above" ? "text-center" : ""
              }`}
            >
              {bubble.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
