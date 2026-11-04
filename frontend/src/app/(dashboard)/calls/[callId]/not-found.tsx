import { PhoneOff } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { IconTile } from "@/components/IconTile";

export default function CallNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-card border border-line bg-paper p-10 text-center">
      <IconTile icon={PhoneOff} />
      <h2 className="text-base font-bold">This call doesn&apos;t exist</h2>
      <p className="max-w-sm text-sm text-ink-muted">It may have been removed, or the link is wrong.</p>
      <CardLink href="/calls" label="Back to calls" />
    </div>
  );
}
