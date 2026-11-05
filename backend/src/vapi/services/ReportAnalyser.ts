import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../faqs/repositories/FaqRepository";
import { MaskedEntityTypeResolver } from "../../guardrails/services/MaskedEntityTypeResolver";
import { SettingsService } from "../../settings/services/SettingsService";
import { CallAnalysisClient } from "../clients/CallAnalysisClient";
import type { CallAnalysis } from "../types/CallAnalysis";
import type { FinishedCallReport } from "../types/FinishedCallReport";

@Injectable()
export class ReportAnalyser {
  constructor(
    private readonly callAnalysisClient: CallAnalysisClient,
    private readonly settingsService: SettingsService,
    private readonly faqRepository: FaqRepository,
    private readonly maskedEntityTypeResolver: MaskedEntityTypeResolver,
  ) {}

  async analyse(report: FinishedCallReport, maskLines = true): Promise<CallAnalysis> {
    const [privacy, handOff, faqs] = await Promise.all([this.settingsService.getPrivacy(), this.settingsService.getHandOff(), this.faqRepository.findActive()]);
    const analysis = await this.callAnalysisClient.analyse({
      callId: report.callId,
      lines: report.lines,
      endedReason: report.endedReason,
      maskKinds: this.maskedEntityTypeResolver.resolve(privacy),
      faqs: faqs.map((faq) => ({ number: faq.sortOrder, question: faq.question })),
      handOffSentence: handOff.handOffSentence,
      callerNumber: report.customerNumber ?? "",
      maskLines,
    });
    return { ...analysis, isHandedOff: analysis.isHandedOff || report.handOffReason !== null };
  }
}
