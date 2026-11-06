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
  /**
   * Clips that share a `group` start together once all of them can play, loop together
   * (a shorter clip holds its last frame until the longest one ends) and are paused and
   * replayed together, so they never drift apart.
   */
  group?: string;
};

// Deliberately a translucent black "glass" button over the video (copied from rachelchen.tech
// at the owner's request), an exception to the no-pure-black / no-blur rules in CLAUDE.md.
const buttonClass =
  "rounded-pill bg-black/50 p-item-8 text-white backdrop-blur-xs transition-colors duration-200 hover:bg-black/90";

const groups = new Map<string, Set<HTMLVideoElement>>();

function playAll(videos: Iterable<HTMLVideoElement>, fromStart: boolean) {
  const list = [...videos];
  if (fromStart) for (const v of list) v.currentTime = 0;
  // The browser can refuse or interrupt play() (for example when it pauses an off-screen silent video
  // to save power). That is harmless, so the rejection is swallowed instead of becoming an error.
  for (const v of list) v.play().catch(() => {});
}

/** A silent looping clip that holds on its first frame for reduced-motion users. */
export function LoopVideo({ src, label, className, size, controls, group }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(!group);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!group) {
      if (reduced) video.pause();
      return;
    }

    let members = groups.get(group);
    if (!members) groups.set(group, (members = new Set()));
    members.add(video);
    let started = false;

    const tryStart = () => {
      if (started || reduced) return;
      // Wait until every clip in the group can play, then start them on the same tick.
      if ([...members].every((v) => v.readyState >= 3)) {
        started = true;
        playAll(members, true);
      }
    };
    const onEnded = () => {
      // Loop together: restart only once the longest clip has also finished.
      if ([...members].every((v) => v.ended)) playAll(members, true);
    };

    video.addEventListener("canplay", tryStart);
    video.addEventListener("ended", onEnded);
    tryStart();
    return () => {
      video.removeEventListener("canplay", tryStart);
      video.removeEventListener("ended", onEnded);
      members.delete(video);
      if (members.size === 0) groups.delete(group);
    };
  }, [group]);

  function everyVideo(): HTMLVideoElement[] {
    const video = ref.current;
    if (!video) return [];
    return (group && [...(groups.get(group) ?? [])]) || [video];
  }

  function toggle() {
    const videos = everyVideo();
    if (videos.length === 0) return;
    if (videos.every((v) => v.paused)) {
      // A clip that had already finished would restart alone, so restart all instead.
      playAll(videos, videos.some((v) => v.ended));
    } else {
      for (const v of videos) v.pause();
    }
  }

  function replay() {
    playAll(everyVideo(), true);
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        aria-label={label}
        autoPlay={!group}
        muted
        loop={!group}
        playsInline
        preload={group ? "auto" : "metadata"}
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
