import { Injectable, Logger } from "@nestjs/common";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { SettingsService } from "../../settings/services/SettingsService";

@Injectable()
export class VapiCallArchive {
  private readonly logger = new Logger(VapiCallArchive.name);
  private readonly vapiCallsUrl = "https://api.vapi.ai/call";

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly settingsService: SettingsService,
  ) {}

  async removeIfEnabled(callId: string): Promise<void> {
    if (!this.appConfiguration.isVapiApiConfigured) return;
    const privacy = await this.settingsService.getPrivacy();
    if (!privacy.deleteVapiCopy) return;
    await this.removeCall(callId);
  }

  private async removeCall(callId: string): Promise<void> {
    try {
      const response = await fetch(`${this.vapiCallsUrl}/${encodeURIComponent(callId)}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${this.appConfiguration.vapiApiKey}` },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) this.logger.warn(`Vapi kept call ${callId}: it answered ${response.status}`);
    } catch (error) {
      this.logger.warn(`Could not delete call ${callId} from Vapi: ${String(error)}`);
    }
  }
}
