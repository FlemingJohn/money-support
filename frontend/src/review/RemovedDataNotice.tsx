import { ShieldCheck } from "lucide-react";
import type { RemovedDataNoticeProps } from "@/types/RemovedDataNoticeProps";

export function RemovedDataNotice({ removedTypes }: RemovedDataNoticeProps) {
  if (removedTypes.length === 0) return null;

  return (
    <p className="flex items-center gap-2.5 rounded-card border border-line bg-redacted-wash px-4 py-3 text-sm text-redacted-ink">
      <ShieldCheck size={18} strokeWidth={1.9} aria-hidden="true" className="shrink-0" />
      <span>
        <strong className="first-letter:uppercase">{removedTypes.join(", ")}</strong> removed from the transcript. The original was never stored.
      </span>
    </p>
  );
}
