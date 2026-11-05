import { Injectable } from "@nestjs/common";
import { PromptVersionRepository } from "../../assistant/repositories/PromptVersionRepository";
import type { CallCompletion } from "../../calls/types/CallCompletion";
import { CustomerNumberMasker } from "../../calls/services/CustomerNumberMasker";
import { FaqRepository } from "../../faqs/repositories/FaqRepository";
import { CallChannel, CallOutcome, type Faq } from "../../generated/prisma/client";
import { SettingsService } from "../../settings/services/SettingsService";
import type { FinishedCallReport } from "../types/FinishedCallReport";
import type { CallAnalysis } from "../types/CallAnalysis";

@Injectable()
export class CallCompletionBuilder {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly faqRepository: FaqRepository,
    private readonly promptVersionRepository: PromptVersionRepository,
    private readonly customerNumberMasker: CustomerNumberMasker,
  ) {}

  async build(report: FinishedCallReport, analysis: CallAnalysis): Promise<CallCompletion> {
    const [privacy, matchedFaq, promptVersion] = await Promise.all([
      this.settingsService.getPrivacy(),
      this.findMatchedFaq(analysis.matchedFaqNumber),
      this.promptVersionRepository.findCurrent(),
    ]);
    const shouldKeepNumber = privacy.keepNumbersForCallbacks && report.channel === CallChannel.phone;
    return {
      callId: report.callId,
      channel: report.channel,
      startedAt: report.startedAt,
      endedAt: report.endedAt,
      endedReason: report.endedReason,
      summary: analysis.summary,
      topic: analysis.topic,
      outcome: analysis.isHandedOff ? CallOutcome.handedOff : CallOutcome.resolved,
      maskedCustomerNumber: this.customerNumberMasker.mask(report.customerNumber),
      customerNumber: shouldKeepNumber ? report.customerNumber : null,
      matchedFaqId: matchedFaq?.id ?? null,
      promptVersionId: promptVersion?.id ?? null,
    };
  }

  private findMatchedFaq(faqNumber: number | null): Promise<Faq | null> {
    if (faqNumber === null) return Promise.resolve(null);
    return this.faqRepository.findByNumber(faqNumber);
  }
}
