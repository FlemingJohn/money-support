export interface AgentSyncResponse {
  status: "synced" | "skipped" | "failed";
  promptVersionId: string | null;
}
