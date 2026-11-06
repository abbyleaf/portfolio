type SectionHeaderProps = {
  marker: string;
  title: string;
  subtitle: string;
  tone?: "cool" | "warm" | "pink";
  titleId?: string;
  /** The page title on a page with no other h1; every other header stays an h2. */
  as?: "h1" | "h2";
};

export function SectionHeader({
  marker,
  title,
  subtitle,
  tone = "cool",
  titleId,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-item-18">
      <p className="font-mono text-mono-marker uppercase text-text-muted">
        {marker}
      </p>
      <Heading id={titleId} className="flex flex-col">
        <span className="font-sans text-heading-inter-xl text-text-primary">
          {title}
        </span>
        <span
          className={`font-heading font-wonk text-heading-fraunces-italic-xl italic ${
            tone === "warm"
              ? "text-text-accent-warm"
              : tone === "pink"
                ? "text-red-400"
                : "text-text-accent-cool"
          }`}
        >
          {subtitle}
        </span>
      </Heading>
    </div>
  );
}
