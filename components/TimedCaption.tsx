"use client";

import { useEffect, useRef, useState } from "react";

export type TimedCaptionStep = {
  /** Second of the clip at which this caption starts. */
  at: number;
  label: string;
};

/**
 * A figure caption that follows the clip in the same `<figure>`: it shows the last step whose
 * `at` the clip has reached, and goes back to the first when the clip loops. It renders the
 * first step on the server and with scripts off, so it reads correctly without JavaScript.
 */
export function TimedCaption({
  steps,
  className,
}: {
  steps: TimedCaptionStep[];
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const video = ref.current?.closest("figure")?.querySelector("video");
    if (!video) return;
    const update = () => {
      let next = 0;
      steps.forEach((step, i) => {
        if (video.currentTime >= step.at) next = i;
      });
      setIndex(next);
    };
    video.addEventListener("timeupdate", update);
    video.addEventListener("seeked", update);
    video.addEventListener("ended", update);
    update();
    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("seeked", update);
      video.removeEventListener("ended", update);
    };
  }, [steps]);

  return (
    <figcaption ref={ref} className={className}>
      {steps[index].label}
    </figcaption>
  );
}
