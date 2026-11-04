import { Injectable, Logger } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { ReviewReason } from "../../generated/prisma/client";
import { PendingAnalysisBuilder } from "../services/PendingAnalysisBuilder";
import type { CallAnalysis } from "../types/CallAnalysis";
import type { CallAnalysisInput } from "../types/CallAnalysisInput";
import { CallAnalysisClient } from "./CallAnalysisClient";

@Injectable()
export class AiCallAnalysisClient extends CallAnalysisClient {
  private static readonly responseSchema = z.object({
    lines: z.array(z.object({ position: z.number().int(), redactedText: z.string(), removedKinds: z.array(z.string()), isChecked: z.boolean() })),
    summary: z.string().nullable(),
    topic: z.string().nullable(),
    matchedFaqNumber: z.number().int().positive().nullable(),
    isHandedOff: z.boolean(),
    fields: z.array(z.object({ label: z.string(), value: z.string(), confidence: z.number().min(0).max(1) })),
    suggestedReview: z.object({ reason: z.enum(ReviewReason) }).nullable(),
    isComplete: z.boolean(),
  });

  private readonly logger = new Logger(AiCallAnalysisClient.name);
  private readonly timeoutMilliseconds = 55_000;

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly pendingAnalysisBuilder: PendingAnalysisBuilder,
  ) {
    super();
  }

  async analyse(input: CallAnalysisInput): Promise<CallAnalysis> {
    try {
      return this.toAnalysis(input, await this.requestAnalysis(input));
    } catch (error) {
      this.logger.warn(`ai/ analysis failed, saving the call as waiting for a privacy check: ${String(error)}`);
      return this.pendingAnalysisBuilder.build(input);
    }
  }

  private async requestAnalysis(input: CallAnalysisInput) {
    const response = await fetch(`${this.appConfiguration.aiServiceUrl}/analysis`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-service-secret": this.appConfiguration.serviceSecret },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(this.timeoutMilliseconds),
    });
    if (!response.ok) throw new Error(`ai/ answered ${response.status}`);
    return AiCallAnalysisClient.responseSchema.parse(await response.json());
  }

  private toAnalysis(input: CallAnalysisInput, result: z.infer<typeof AiCallAnalysisClient.responseSchema>): CallAnalysis {
    const linesByPosition = new Map(result.lines.map((line) => [line.position, line]));
    return {
      lines: input.lines.map((line) => {
        const masked = linesByPosition.get(line.position);
        const isChecked = masked?.isChecked ?? false;
        return {
          position: line.position,
          speaker: line.speaker,
          secondsFromStart: line.secondsFromStart,
          redactedText: isChecked && masked ? masked.redactedText : "[waiting for privacy check]",
          removedEntityTypes: isChecked && masked ? masked.removedKinds : [],
        };
      }),
      summary: result.summary,
      topic: result.topic,
      matchedFaqNumber: result.matchedFaqNumber,
      isHandedOff: result.isHandedOff,
      fields: result.fields,
      suggestedReviewReason: result.suggestedReview?.reason ?? null,
      isComplete: result.isComplete,
    };
  }
}
