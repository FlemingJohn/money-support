import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { AgentSyncNoticeProps } from "@/types/AgentSyncNoticeProps";

export function AgentSyncNotice({ agentSync }: AgentSyncNoticeProps) {
  if (!agentSync) return null;

  if (agentSync.status === "synced") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-control bg-success-wash px-3 py-2 text-sm text-success-ink">
        <CircleCheck size={16} strokeWidth={2} aria-hidden="true" />
        Saved. The agent now uses this change.
      </p>
    );
  }

  if (agentSync.status === "skipped") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-control bg-sand px-3 py-2 text-sm text-ink-muted">
        <Info size={16} strokeWidth={2} aria-hidden="true" />
        Saved. The agent isn&apos;t connected, so it wasn&apos;t updated.
      </p>
    );
  }

  return (
    <p role="alert" className="flex items-center gap-2 rounded-control bg-handoff-wash px-3 py-2 text-sm text-handoff-ink">
      <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
      Saved, but the agent couldn&apos;t be updated. Save again to retry.
    </p>
  );
}
