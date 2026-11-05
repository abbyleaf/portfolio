"use client";

import { useEffect, useRef } from "react";

type LoopVideoProps = {
  src: string;
  label: string;
  className?: string;
  /** The clip's pixel size, so its box is reserved before it loads. */
  size?: { width: number; height: number };
};

/** A silent looping clip that holds on its first frame for reduced-motion users. */
export function LoopVideo({ src, label, className, size }: LoopVideoProps) {
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
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      style={size ? { aspectRatio: `${size.width} / ${size.height}` } : undefined}
    />
  );
}
