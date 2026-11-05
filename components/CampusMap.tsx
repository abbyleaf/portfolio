"use client";

import { useSyncExternalStore } from "react";

/*
 * The two campus maps in the Design Challenge section, drawn as inline SVG so they use the
 * site's fonts and colour tokens and can respond to reduced motion. Stop positions come from
 * the original campus map: they sit in a 508 x 300 drawing, and `at()` places them on this
 * 1382 x 846 canvas.
 */

const SCALE = 2.85;
const OFFSET_X = -33.4;
const OFFSET_Y = 49.8;
const at = ([x, y]: readonly [number, number]) =>
  [Math.round((x * SCALE + OFFSET_X) * 10) / 10, Math.round((y * SCALE + OFFSET_Y) * 10) / 10] as const;

const STOPS = {
  "01": [83.1, 59.5],
  "02": [106.5, 97.2],
  "03": [120.8, 125.8],
  "04": [141.6, 138.8],
  "05": [162.4, 133.6],
  "06": [172.8, 205.1],
  "07": [194.9, 184.3],
  "08": [181.9, 237.6],
  "09": [219.6, 142.7],
  "10": [217.0, 179.1],
  "11": [249.5, 168.7],
  "12": [280.7, 157.0],
  "13": [315.8, 146.6],
  "14": [379.5, 132.3],
  "15": [348.3, 128.4],
  "16": [360.0, 99.8],
  "17": [356.1, 72.5],
  "18": [375.6, 218.1],
} as const;
type StopId = keyof typeof STOPS;

const OUTLINE =
  "M65.1748 87.9754L72.8726 57.1669L94.6828 46.8975L115.21 52.0322L125.474 71.2875L123.678 99.5286L134.455 106.46L146.001 101.326L162.68 91.8265L183.207 87.9754L198.602 95.6775L219.13 98.2449L234.525 89.2591L249.921 81.557L260.184 67.4364L275.58 55.8833L296.107 54.5996L314.069 61.018L334.596 75.1386L342.294 95.6775L337.162 113.649L319.201 123.919L306.371 121.351L293.541 129.053L280.712 139.323L267.882 144.458L252.487 141.89L234.525 147.025L219.13 157.294H198.602L183.207 164.997L170.377 175.266L162.68 195.805L152.416 208.128L139.586 204.021L131.889 188.103L129.323 170.131L119.059 157.294L103.664 147.025L85.7021 136.755L72.8726 123.919L65.1748 87.9754Z";
const ISLAND = "M285.844 172.699L311.503 169.618L320.227 182.968L308.937 193.751L287.896 190.67L285.844 172.699Z";
const MAP_TRANSFORM = `translate(${OFFSET_X} ${OFFSET_Y}) scale(${SCALE}) translate(74 40) scale(1.3) translate(-65 -47)`;

// On-demand: the curved ride from stop 08 to stop 12 (already in canvas units).
const RIDE_CURVE =
  "M521 684 C520 676.7 523.5 662.3 515 640 C506.5 617.7 474.2 576.7 470 550 C465.8 523.3 479.2 498.8 490 480 C500.8 461.2 516.7 448.7 535 437 C553.3 425.3 575.8 412.8 600 410 C624.2 407.2 656.3 411.3 680 420 C703.7 428.7 731.7 455 742 462";
const RIDE_ARROW = "translate(742 462) rotate(34)";

// Shuttle: route 2, one way from stop 17 to stop 04.
const SHUTTLE_ROUTE: StopId[] = ["17", "15", "13", "12", "11", "10", "06", "04"];
const ARROW_PATH = "M-14 -14 L11 0 L-14 14 Z";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor prefers reduced motion. The server render assumes it, so it starts still. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

function Stop({
  id,
  big,
  filled,
}: {
  id: StopId;
  big?: boolean;
  filled?: boolean;
}) {
  const [x, y] = at(STOPS[id]);
  const dark = big || filled;
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={dark ? 40 : 31}
        strokeWidth={6}
        className={dark ? "fill-grey-900 stroke-grey-900" : "fill-surface-raised stroke-grey-900"}
      />
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize={28}
        fontWeight={700}
        className={dark ? "fill-surface-raised" : "fill-text-primary"}
      >
        {id}
      </text>
    </g>
  );
}

function Backdrop({ title }: { title: string }) {
  return (
    <>
      <rect
        x={3}
        y={3}
        width={1376}
        height={840}
        strokeWidth={6}
        className="fill-surface-raised stroke-border-canvas-subtle"
      />
      <g transform={MAP_TRANSFORM}>
        <path
          d={OUTLINE}
          strokeWidth={2.3}
          className="fill-surface-canvas/60 stroke-border-canvas-subtle"
        />
        <path
          d={ISLAND}
          strokeWidth={2.3}
          className="fill-surface-canvas/60 stroke-border-canvas-subtle"
        />
      </g>
      <text x={50} y={86} fontSize={32} letterSpacing={2} className="fill-text-muted">
        {title}
      </text>
    </>
  );
}

function OnDemandMap() {
  const [x17, y17] = at(STOPS["17"]);
  const [x08, y08] = at(STOPS["08"]);
  const [x12, y12] = at(STOPS["12"]);
  const stops = (Object.keys(STOPS) as StopId[]).filter(
    (id) => id !== "08" && id !== "12" && id !== "17",
  );
  return (
    <>
      <Backdrop title="SELECT PICK-UP AND DROP-OFF POINTS FROM LIST OF LOCATIONS" />
      {stops.map((id) => (
        <Stop key={id} id={id} />
      ))}
      {/* The ride: dashes flow from pick-up to drop-off (paused for reduced motion). */}
      <path
        d={RIDE_CURVE}
        fill="none"
        strokeWidth={9}
        strokeLinecap="butt"
        strokeDasharray="20 17"
        className="route-flow stroke-grey-900"
      />
      <path d={ARROW_PATH} transform={RIDE_ARROW} className="fill-grey-900" />
      <Stop id="08" big />
      <Stop id="12" big />
      <text x={x08 - 190} y={y08 + 14} fontSize={28} fontWeight={700} letterSpacing={2} className="fill-text-primary">
        PICK-UP
      </text>
      <text x={x12 + 19} y={y12 + 80} fontSize={28} fontWeight={700} letterSpacing={2} className="fill-text-primary">
        DROP-OFF
      </text>
      {/* The dormitory is not served by on-demand rides. */}
      <circle
        cx={x17}
        cy={y17}
        r={40}
        strokeWidth={6}
        className="fill-grey-100 stroke-text-sub-headers"
      />
      <text x={x17} y={y17 + 10} textAnchor="middle" fontSize={28} fontWeight={700} className="fill-text-sub-headers">
        17
      </text>
      <line
        x1={x17 - 29}
        y1={y17 + 29}
        x2={x17 + 29}
        y2={y17 - 29}
        strokeWidth={5}
        className="stroke-text-muted"
      />
      <text x={x17 + 58} y={y17 - 14} fontSize={28} letterSpacing={2} className="fill-text-muted">
        DORMITORY
      </text>
      <text x={x17 + 58} y={y17 + 26} fontSize={28} letterSpacing={2} className="fill-text-muted">
        NOT SERVED
      </text>
    </>
  );
}

function ShuttleMap({ animate }: { animate: boolean }) {
  const points = SHUTTLE_ROUTE.map((id) => at(STOPS[id]));
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  // An arrowhead halfway along three of the legs shows which way the shuttle runs.
  const arrows = [0, 5, 6].map((i) => {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return `translate(${(x1 + x2) / 2} ${(y1 + y2) / 2}) rotate(${angle})`;
  });
  const [x17, y17] = at(STOPS["17"]);
  const [x12, y12] = at(STOPS["12"]);
  return (
    <>
      <Backdrop title="SHUTTLE SERVICE ROUTE 2 · STOP 17 TO 04 ONLY" />
      <polyline
        points={line}
        fill="none"
        strokeWidth={11}
        strokeLinejoin="miter"
        className="stroke-grey-900"
      />
      {arrows.map((transform) => (
        <path key={transform} d={ARROW_PATH} transform={transform} className="fill-grey-900" />
      ))}
      {SHUTTLE_ROUTE.map((id) => (
        <Stop key={id} id={id} big={id === "17" || id === "12"} />
      ))}
      {/* The shuttle itself, running the route on a loop. */}
      {animate && (
        <circle r={17} strokeWidth={6} className="fill-vermilion-500 stroke-surface-raised">
          <animateMotion dur="9s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      <text x={x17 - 66} y={y17 - 70} fontSize={28} fontWeight={700} letterSpacing={2} className="fill-text-primary">
        PICK-UP
      </text>
      <text x={x17 + 62} y={y17 - 8} fontSize={28} letterSpacing={2} className="fill-text-muted">
        DORMITORY
      </text>
      <text x={x12 + 19} y={y12 + 80} fontSize={28} fontWeight={700} letterSpacing={2} className="fill-text-primary">
        DROP-OFF
      </text>
    </>
  );
}

type CampusMapProps = {
  variant: "on-demand" | "shuttle";
  /** Describes the map for people who cannot see it. */
  label: string;
};

/** A framed campus map with a moving cue: flowing dashes for on-demand, a travelling shuttle. */
export function CampusMap({ variant, label }: CampusMapProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <svg
      viewBox="0 0 1382 846"
      role="img"
      aria-label={label}
      className="h-auto w-full font-mono"
    >
      {variant === "on-demand" ? <OnDemandMap /> : <ShuttleMap animate={!reduced} />}
    </svg>
  );
}
