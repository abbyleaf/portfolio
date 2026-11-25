import { PasswordGate } from "./PasswordGate";

/**
 * Stands in for <Locked> on the locked page. It is a server component that ignores its
 * children, so the hidden part of the study is never rendered or sent. (Passing the
 * children to a client component, such as PasswordGate, would send them to the browser.)
 */
export function LockedGate({ landOn, anchors }: { landOn?: string; anchors?: string[] }) {
  return <PasswordGate landOn={landOn} anchors={anchors} />;
}
