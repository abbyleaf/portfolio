const sizes = {
  sm: "text-label-sm",
  md: "text-paragraph-md",
};

export function Tag({
  children,
  size = "sm",
}: {
  children: string;
  size?: keyof typeof sizes;
}) {
  return (
    <li
      className={`rounded-sm bg-surface-canvas px-item-8 py-item-4 font-sans text-text-body ${sizes[size]}`}
    >
      {children}
    </li>
  );
}
