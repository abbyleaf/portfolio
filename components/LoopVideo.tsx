"use client";

import { useEffect, useRef } from "react";

type LoopVideoProps = {
  src: string;
  label: string;
  /** Picture shown until the clip loads. */
  poster?: string;
  className?: string;
};

/** A silent looping clip that holds on its first frame for reduced-motion users. */
export function LoopVideo({ src, label, poster, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
