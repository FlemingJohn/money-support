import { Injectable, Logger } from "@nestjs/common";
import { ActivityLog } from "../activity/ActivityLog";
import { ActivityAction, ActivityItemType } from "../generated/prisma/client";
import type { AgentSyncResponse } from "./AgentSyncResponse";
import { AssistantSyncClient } from "./AssistantSyncClient";
import { PromptVersionRepository } from "./PromptVersionRepository";

@Injectable()
export class AssistantSyncService {
  private readonly logger = new Logger(AssistantSyncService.name);

  constructor(
    private readonly assistantSyncClient: AssistantSyncClient,
    private readonly promptVersionRepository: PromptVersionRepository,
    private readonly activityLog: ActivityLog,
  ) {}

  async syncAgent(): Promise<AgentSyncResponse> {
    const result = await this.assistantSyncClient.requestSync();
    if (result.status === "skipped") return { status: "skipped", promptVersionId: null };
    if (result.status === "failed") return this.recordFailure(result.reason);
    const promptVersion = await this.promptVersionRepository.saveCurrent(result.promptHash, result.promptContent);
    await this.activityLog.record({ action: ActivityAction.agentSynced, itemType: ActivityItemType.agent, itemId: promptVersion.id });
    return { status: "synced", promptVersionId: promptVersion.id };
  }

  private async recordFailure(reason: string): Promise<AgentSyncResponse> {
    this.logger.warn(`Agent sync failed: ${reason}`);
    await this.activityLog.record({ action: ActivityAction.agentSyncFailed, itemType: ActivityItemType.agent, itemId: "assistant" });
    return { status: "failed", promptVersionId: null };
  }
}
