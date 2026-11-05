import { Injectable, Logger } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { maskKindLabels } from "../catalogs/maskKindLabels";
import type { ReportedLineMasking } from "../types/ReportedLineMasking";

@Injectable()
export class ReportedLineMasker {
  private static readonly responseSchema = z.object({ redactedText: z.string(), removedKinds: z.array(z.string()), isChecked: z.boolean() });
  private readonly logger = new Logger(ReportedLineMasker.name);

  constructor(private readonly appConfiguration: AppConfiguration) {}

  async mask(text: string): Promise<ReportedLineMasking | null> {
    if (!this.appConfiguration.isAiServiceConfigured) return null;
    try {
      const response = await fetch(`${this.appConfiguration.aiServiceUrl}/masking/line`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-service-secret": this.appConfiguration.serviceSecret },
        body: JSON.stringify({ text, maskKinds: [...maskKindLabels], isReported: true }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`ai/ answered ${response.status}`);
      return ReportedLineMasker.responseSchema.parse(await response.json());
    } catch (error) {
      this.logger.warn(`Re-checking a reported line failed: ${String(error)}`);
      return null;
    }
  }
}
