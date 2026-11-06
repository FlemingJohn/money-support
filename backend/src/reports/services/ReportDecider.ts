import { Injectable } from "@nestjs/common";
import type { UnmaskedReportDto } from "../dto/UnmaskedReportDto";
import type { ReportDecision } from "../types/ReportDecision";
import type { ReportedLineMasking } from "../types/ReportedLineMasking";

@Injectable()
export class ReportDecider {
  decide(lineText: string, masking: ReportedLineMasking | null, report: UnmaskedReportDto): ReportDecision {
    if (masking?.isChecked && masking.removedKinds.length > 0) {
      return { text: masking.redactedText, kinds: masking.removedKinds, outcome: "masked" };
    }
    if (lineText.includes(report.selectedText)) {
      return { text: lineText.replaceAll(report.selectedText, `[${report.kind} removed]`), kinds: [report.kind], outcome: "masked" };
    }
    return { text: lineText, kinds: [], outcome: "unchanged" };
  }
}
