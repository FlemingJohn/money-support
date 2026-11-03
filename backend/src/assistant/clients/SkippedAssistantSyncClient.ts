import { Injectable } from "@nestjs/common";
import { AssistantSyncClient } from "./AssistantSyncClient";
import type { AssistantSyncResult } from "../types/AssistantSyncResult";

@Injectable()
export class SkippedAssistantSyncClient extends AssistantSyncClient {
  async requestSync(): Promise<AssistantSyncResult> {
    return { status: "skipped" };
  }
}
