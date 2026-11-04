import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { MaskedEntityTypeResolver } from "../../guardrails/services/MaskedEntityTypeResolver";
import { SettingsService } from "../../settings/services/SettingsService";
import type { LineMaskingResponse } from "../responses/LineMaskingResponse";

@Injectable()
export class LineMaskingService {
  private static readonly responseSchema = z.object({ redactedText: z.string(), removedKinds: z.array(z.string()), isChecked: z.boolean() });
  private readonly waitingResponse: LineMaskingResponse = { redactedText: "[waiting for privacy check]", removedKinds: [], isChecked: false };

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly settingsService: SettingsService,
    private readonly maskedEntityTypeResolver: MaskedEntityTypeResolver,
  ) {}

  async mask(text: string): Promise<LineMaskingResponse> {
    if (!this.appConfiguration.isAiServiceConfigured) return this.waitingResponse;
    try {
      const maskKinds = this.maskedEntityTypeResolver.resolve(await this.settingsService.getPrivacy());
      const response = await fetch(`${this.appConfiguration.aiServiceUrl}/masking/line`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-service-secret": this.appConfiguration.serviceSecret },
        body: JSON.stringify({ text, maskKinds }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) return this.waitingResponse;
      return LineMaskingService.responseSchema.parse(await response.json());
    } catch {
      return this.waitingResponse;
    }
  }
}
