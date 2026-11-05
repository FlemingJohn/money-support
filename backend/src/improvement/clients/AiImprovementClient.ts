import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import type { SuggestionResult } from "../types/SuggestionResult";

@Injectable()
export class AiImprovementClient {
  private static readonly responseSchema = z.object({
    ruleText: z.string().min(1),
    explanation: z.string(),
    reviewCallIds: z.array(z.string()),
    passedBefore: z.number().int(),
    passedAfter: z.number().int(),
    totalTests: z.number().int(),
    isBetter: z.boolean(),
  });

  constructor(private readonly appConfiguration: AppConfiguration) {}

  async suggest(): Promise<SuggestionResult | null> {
    const response = await fetch(`${this.appConfiguration.aiServiceUrl}/improvements/suggest`, {
      method: "POST",
      headers: { "x-service-secret": this.appConfiguration.serviceSecret },
      signal: AbortSignal.timeout(295_000),
    });
    if (response.status === 409) return null;
    if (!response.ok) throw new Error(`ai/ answered ${response.status} when suggesting an improvement`);
    return AiImprovementClient.responseSchema.parse(await response.json());
  }
}
