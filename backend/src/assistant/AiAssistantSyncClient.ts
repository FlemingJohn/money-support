import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { AssistantSyncClient } from "./AssistantSyncClient";
import type { AssistantSyncResult } from "./AssistantSyncResult";

@Injectable()
export class AiAssistantSyncClient extends AssistantSyncClient {
  private static readonly responseSchema = z.object({
    promptHash: z.string().min(1),
    promptContent: z.string().min(1),
  });

  constructor(private readonly appConfiguration: AppConfiguration) {
    super();
  }

  async requestSync(): Promise<AssistantSyncResult> {
    try {
      const response = await fetch(`${this.appConfiguration.aiServiceUrl}/assistant/sync`, {
        method: "POST",
        headers: { "x-service-secret": this.appConfiguration.serviceSecret },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) return { status: "failed", reason: `ai/ answered ${response.status}` };
      const body = AiAssistantSyncClient.responseSchema.parse(await response.json());
      return { status: "synced", ...body };
    } catch (error) {
      return { status: "failed", reason: String(error) };
    }
  }
}
