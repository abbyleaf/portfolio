import Image from "next/image";

/** A tilted instant photo with a mono caption. */
export function PortraitPolaroid({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    // The shadow sits on an unrotated wrapper: a filter on the rotated element
    // itself makes the browser resample the photo, which softens it.
    <div className="drop-shadow-polaroid-lg">
      <figure className="flex h-item-400 w-item-320 shrink-0 rotate-(--rotate-polaroid-portrait) flex-col gap-item-12 bg-surface-raised p-item-12">
        <div className="relative min-h-0 w-full flex-1">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="320px"
            quality={90}
            className="object-cover object-bottom"
          />
        </div>
        <figcaption className="text-center font-mono text-mono-polaroid uppercase tracking-caption text-text-accent-warm">
          {caption}
        </figcaption>
      </figure>
    </div>
  );
}
