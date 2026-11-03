export type AssistantSyncResult =
  | { status: "synced"; promptHash: string; promptContent: string }
  | { status: "skipped" }
  | { status: "failed"; reason: string };
