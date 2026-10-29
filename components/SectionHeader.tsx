type SectionHeaderProps = {
  marker: string;
  title: string;
  subtitle: string;
  tone?: "cool" | "warm";
  titleId?: string;
};

export function SectionHeader({
  marker,
  title,
  subtitle,
  tone = "cool",
  titleId,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-item-18">
      <p className="font-mono text-mono-marker uppercase text-text-muted">
        {marker}
      </p>
      <h2 id={titleId} className="flex flex-col">
        <span className="font-sans text-heading-inter-xl text-text-primary">
          {title}
        </span>
        <span
          className={`font-heading font-wonk text-heading-fraunces-italic-xl italic ${
            tone === "warm" ? "text-text-accent-warm" : "text-text-accent-cool"
          }`}
        >
          {subtitle}
        </span>
      </h2>
    </div>
  );
}
