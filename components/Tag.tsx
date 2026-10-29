export function Tag({ children }: { children: string }) {
  return (
    <li className="rounded-sm bg-surface-canvas px-item-8 py-item-4 font-sans text-label-sm text-text-body">
      {children}
    </li>
  );
}
