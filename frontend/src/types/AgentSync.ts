export interface AgentSync {
  status: "synced" | "skipped" | "failed";
  promptVersionId: string | null;
}
