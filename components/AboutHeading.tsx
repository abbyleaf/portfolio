import Image from "next/image";

type AboutHeadingProps = {
  marker: string;
  lead: string;
  accent: string;
  id: string;
};

/** Small star-and-label marker over a two-tone heading. */
export function AboutHeading({ marker, lead, accent, id }: AboutHeadingProps) {
  return (
    <div className="flex flex-col gap-item-16">
      <p className="flex items-center gap-item-4 font-sans text-heading-inter-xs uppercase text-text-muted">
        <Image
          src="/images/about/marker-star.svg"
          alt=""
          width={10}
          height={10}
        />
        {marker}
      </p>
      <h2
        id={id}
        className="font-sans text-heading-inter-section text-text-body"
      >
        {lead} <span className="text-red-400">{accent}</span>
      </h2>
    </div>
  );
}
