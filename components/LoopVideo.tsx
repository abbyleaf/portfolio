"use client";

import { useEffect, useRef, useState } from "react";

type LoopVideoProps = {
  src: string;
  label: string;
  className?: string;
  /** The clip's pixel size, so its box is reserved before it loads. */
  size?: { width: number; height: number };
  /**
   * Adds pause/play and replay buttons in the top-right corner of the nearest ancestor
   * that is `relative` and has the `group/clip` class. They show on hover and keyboard
   * focus, and always on touch screens.
   */
  controls?: boolean;
};

// Deliberately a translucent black "glass" button over the video (copied from rachelchen.tech
// at the owner's request), an exception to the no-pure-black / no-blur rules in CLAUDE.md.
const buttonClass =
  "rounded-pill bg-black/50 p-item-8 text-white backdrop-blur-xs transition-colors duration-200 hover:bg-black/90";

/** A silent looping clip that holds on its first frame for reduced-motion users. */
export function LoopVideo({ src, label, className, size, controls }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function replay() {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }

  return (
    <>
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
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {controls && (
        <div className="absolute top-item-12 right-item-12 flex gap-item-8 opacity-0 transition-opacity duration-200 group-focus-within/clip:opacity-100 group-hover/clip:opacity-100 pointer-coarse:opacity-100">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className={buttonClass}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              {playing ? (
                <>
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </>
              ) : (
                <path d="M7 4l13 8-13 8z" />
              )}
            </svg>
          </button>
          <button type="button" onClick={replay} aria-label="Replay video" className={buttonClass}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
