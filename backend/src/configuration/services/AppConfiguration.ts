import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../types/EnvironmentVariables";

@Injectable()
export class AppConfiguration {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get port(): number {
    return this.configService.get("PORT", { infer: true });
  }

  get frontendOrigin(): string {
    return this.configService.get("FRONTEND_ORIGIN", { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.get("DATABASE_URL", { infer: true });
  }

  get databaseCaCertificate(): string {
    return this.configService.get("DATABASE_CA_CERTIFICATE", { infer: true }).replaceAll("\\n", "\n");
  }

  get vapiWebhookSecret(): string {
    return this.configService.get("VAPI_WEBHOOK_SECRET", { infer: true });
  }

  get vapiApiKey(): string {
    return this.configService.get("VAPI_API_KEY", { infer: true });
  }

  get serviceSecret(): string {
    return this.configService.get("SERVICE_SECRET", { infer: true });
  }

  get cronSecret(): string {
    return this.configService.get("CRON_SECRET", { infer: true });
  }

  get aiServiceUrl(): string {
    return this.configService.get("AI_SERVICE_URL", { infer: true });
  }

  get encryptionKey(): string {
    return this.configService.get("ENCRYPTION_KEY", { infer: true });
  }

  get twilioAccountSid(): string {
    return this.configService.get("TWILIO_ACCOUNT_SID", { infer: true });
  }

  get twilioAuthToken(): string {
    return this.configService.get("TWILIO_AUTH_TOKEN", { infer: true });
  }

  get twilioCallerNumber(): string {
    return this.configService.get("TWILIO_CALLER_NUMBER", { infer: true });
  }

  get mailUser(): string {
    return this.configService.get("MAIL_USER", { infer: true });
  }

  get mailAppPassword(): string {
    return this.configService.get("MAIL_APP_PASSWORD", { infer: true }).replaceAll(" ", "");
  }

  get hasDatabaseCaCertificate(): boolean {
    return this.databaseCaCertificate.length > 0;
  }

  get isAiServiceConfigured(): boolean {
    return this.aiServiceUrl.length > 0;
  }

  get isTwilioConfigured(): boolean {
    return [this.twilioAccountSid, this.twilioAuthToken, this.twilioCallerNumber].every((value) => value.length > 0);
  }

  get isMailConfigured(): boolean {
    return this.mailUser.length > 0 && this.mailAppPassword.length > 0;
  }

  get isVapiApiConfigured(): boolean {
    return this.vapiApiKey.length > 0;
  }
}
