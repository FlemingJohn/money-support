import type { AssistantSyncResult } from "./AssistantSyncResult";

export abstract class AssistantSyncClient {
  abstract requestSync(): Promise<AssistantSyncResult>;
}
