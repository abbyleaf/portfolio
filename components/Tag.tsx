const tones = {
  canvas: "bg-surface-canvas text-text-body text-tag",
  // The contribution list on a case study: larger, tinted azure.
  cool: "bg-surface-light-accent-cool text-blue-600 text-paragraph-md",
};

export function Tag({
  children,
  tone = "canvas",
}: {
  children: string;
  tone?: keyof typeof tones;
}) {
  return (
    <li
      className={`rounded-sm px-item-8 py-item-4 font-sans ${tones[tone]}`}
    >
      {children}
    </li>
  );
}
