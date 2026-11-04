"use client";

import { useEffect, useState } from "react";
import type { AgentStatus } from "@/types/AgentStatus";
import type { ServiceHealth } from "@/types/ServiceHealth";

export function useAgentStatus(): AgentStatus {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<ServiceHealth>) : null))
      .then((health) => setAgentStatus(health?.isHealthy ? "live" : "issue"))
      .catch(() => {
        if (!controller.signal.aborted) setAgentStatus("issue");
      });
    return () => controller.abort();
  }, []);

  return agentStatus;
}
