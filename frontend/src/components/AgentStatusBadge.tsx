"use client";

import { useAgentStatus } from "@/hooks/useAgentStatus";
import type { AgentStatus } from "@/types/AgentStatus";
import type { StatusLook } from "@/types/StatusLook";

export function AgentStatusBadge() {
  const agentStatus = useAgentStatus();
  const look = looks[agentStatus];

  return (
    <span role="status" className={`inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold ${look.colors}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${look.dot}`} />
      {look.label}
    </span>
  );
}

const looks: Record<AgentStatus, StatusLook> = {
  checking: { label: "Checking agent", colors: "bg-sand text-ink-muted", dot: "bg-ink-faint" },
  live: { label: "Agent live", colors: "bg-success-wash text-success-ink", dot: "bg-success" },
  issue: { label: "Service issue", colors: "bg-handoff-wash text-handoff-ink", dot: "bg-handoff-ink" },
};
