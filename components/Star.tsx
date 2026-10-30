/**
 * A five-point star drawn as an SVG. The ★ character is not in Space Mono, so each
 * device substitutes its own font and the star comes out a different size; this one
 * looks the same everywhere. Size it with a `size-*` class and colour it with `text-*`.
 */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d="M12 0.9L15.24 8.43L23.41 9.19L17.25 14.61L19.05 22.61L12 18.42L4.95 22.61L6.75 14.61L0.59 9.19L8.76 8.43Z" />
    </svg>
  );
}
