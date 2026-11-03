import { Injectable } from "@nestjs/common";
import { CallMessageRepository } from "../calls/repositories/CallMessageRepository";
import { CallRepository } from "../calls/repositories/CallRepository";
import { ExtractedFieldRepository } from "../calls/repositories/ExtractedFieldRepository";
import { Clock } from "../common/services/Clock";
import type { PhoneSettingsDto } from "../settings/PhoneSettingsDto";
import { SettingsService } from "../settings/SettingsService";
import type { RetentionResult } from "./RetentionResult";

@Injectable()
export class RetentionService {
  private readonly dayInMilliseconds = 24 * 60 * 60 * 1000;
  private readonly storedNumberDays = 7;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly callRepository: CallRepository,
    private readonly callMessageRepository: CallMessageRepository,
    private readonly extractedFieldRepository: ExtractedFieldRepository,
    private readonly clock: Clock,
  ) {}

  async applyRetention(): Promise<RetentionResult> {
    const [privacy, phone] = await Promise.all([this.settingsService.getPrivacy(), this.settingsService.getPhone()]);
    const transcriptCutoff = this.daysAgo(privacy.transcriptRetentionDays);
    const deletedFieldCount = await this.extractedFieldRepository.deleteForCallsEndedBefore(transcriptCutoff);
    const deletedMessageCount = await this.callMessageRepository.deleteForCallsEndedBefore(transcriptCutoff);
    const clearedNumberCount = await this.clearStoredNumbers(phone);
    return { deletedMessageCount, deletedFieldCount, clearedNumberCount };
  }

  private clearStoredNumbers(phone: PhoneSettingsDto): Promise<number> {
    if (phone.storedNumberRetention === "whenResolved") return this.callRepository.clearStoredNumbersForResolvedReviews();
    return this.callRepository.clearStoredNumbersEndedBefore(this.daysAgo(this.storedNumberDays));
  }

  private daysAgo(days: number): Date {
    return new Date(this.clock.now().getTime() - days * this.dayInMilliseconds);
  }
}
