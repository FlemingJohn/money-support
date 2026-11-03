import { Injectable } from "@nestjs/common";
import { PromptVersionRepository } from "../../assistant/repositories/PromptVersionRepository";
import type { CallCompletion } from "../../calls/types/CallCompletion";
import { CustomerNumberProtector } from "../../calls/services/CustomerNumberProtector";
import { FaqRepository } from "../../faqs/repositories/FaqRepository";
import { CallChannel, CallOutcome, type Faq } from "../../generated/prisma/client";
import { SettingsService } from "../../settings/services/SettingsService";
import type { FinishedCallReport } from "../types/FinishedCallReport";
import type { RedactedReport } from "../types/RedactedReport";

@Injectable()
export class CallCompletionBuilder {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly faqRepository: FaqRepository,
    private readonly promptVersionRepository: PromptVersionRepository,
    private readonly customerNumberProtector: CustomerNumberProtector,
  ) {}

  async build(report: FinishedCallReport, redactedReport: RedactedReport, needsReview: boolean): Promise<CallCompletion> {
    const [privacy, matchedFaq, promptVersion] = await Promise.all([
      this.settingsService.getPrivacy(),
      this.findMatchedFaq(report.matchedFaqNumber),
      this.promptVersionRepository.findCurrent(),
    ]);
    const shouldKeepNumber = needsReview && privacy.keepNumbersForCallbacks && report.channel === CallChannel.phone;
    const customerNumber = this.customerNumberProtector.protect(report.customerNumber, shouldKeepNumber);
    return {
      callId: report.callId,
      channel: report.channel,
      startedAt: report.startedAt,
      endedAt: report.endedAt,
      endedReason: report.endedReason,
      summary: redactedReport.summary,
      topic: redactedReport.topic,
      outcome: report.isHandedOff ? CallOutcome.handedOff : CallOutcome.resolved,
      maskedCustomerNumber: customerNumber.masked,
      encryptedCustomerNumber: customerNumber.encrypted,
      matchedFaqId: matchedFaq?.id ?? null,
      promptVersionId: promptVersion?.id ?? null,
    };
  }

  private findMatchedFaq(faqNumber: number | null): Promise<Faq | null> {
    if (faqNumber === null) return Promise.resolve(null);
    return this.faqRepository.findByNumber(faqNumber);
  }
}
