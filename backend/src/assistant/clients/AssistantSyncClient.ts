import type { AssistantSyncResult } from "../types/AssistantSyncResult";

export abstract class AssistantSyncClient {
  abstract requestSync(): Promise<AssistantSyncResult>;
}
