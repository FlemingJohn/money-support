import { Injectable, Logger } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { PatternRedactionClient } from "./PatternRedactionClient";
import type { RedactedLine } from "../types/RedactedLine";
import { RedactionClient } from "./RedactionClient";
import type { TranscriptLine } from "../types/TranscriptLine";

@Injectable()
export class AiRedactionClient extends RedactionClient {
  private static readonly responseSchema = z.object({
    results: z.array(
      z.object({
        redactedText: z.string(),
        entities: z.array(z.object({ entityType: z.string() })),
      }),
    ),
  });

  private readonly logger = new Logger(AiRedactionClient.name);

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly fallbackClient: PatternRedactionClient,
  ) {
    super();
  }

  async redactLines(lines: TranscriptLine[]): Promise<RedactedLine[]> {
    try {
      return await this.requestRedaction(lines);
    } catch (error) {
      this.logger.warn(`ai/ redaction failed, using pattern redaction instead: ${String(error)}`);
      return this.fallbackClient.redactLines(lines);
    }
  }

  private async requestRedaction(lines: TranscriptLine[]): Promise<RedactedLine[]> {
    const response = await fetch(`${this.appConfiguration.aiServiceUrl}/guardrails/redact`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-service-secret": this.appConfiguration.serviceSecret },
      body: JSON.stringify({ texts: lines.map((line) => line.text) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`ai/ answered ${response.status}`);
    const { results } = AiRedactionClient.responseSchema.parse(await response.json());
    if (results.length !== lines.length) throw new Error("ai/ returned a different number of lines");
    return lines.map((line, index) => ({
      position: line.position,
      speaker: line.speaker,
      redactedText: results[index].redactedText,
      secondsFromStart: line.secondsFromStart,
      removedEntityTypes: results[index].entities.map((entity) => entity.entityType),
    }));
  }
}
