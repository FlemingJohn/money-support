import { Injectable } from "@nestjs/common";
import { Speaker } from "../../generated/prisma/client";
import { RedactionClient } from "../../guardrails/clients/RedactionClient";
import type { TranscriptLine } from "../../guardrails/types/TranscriptLine";
import type { FinishedCallReport } from "../types/FinishedCallReport";
import type { RedactedReport } from "../types/RedactedReport";

@Injectable()
export class ReportRedactor {
  constructor(private readonly redactionClient: RedactionClient) {}

  async redact(report: FinishedCallReport): Promise<RedactedReport> {
    const extraTexts = [report.summary ?? "", report.topic ?? "", ...report.fields.map((field) => field.value)];
    const redacted = await this.redactionClient.redactLines([...report.lines, ...this.toExtraLines(extraTexts, report.lines.length)]);
    const lineCount = report.lines.length;
    const [summary, topic, ...fieldValues] = redacted.slice(lineCount).map((line) => line.redactedText);
    return {
      lines: redacted.slice(0, lineCount),
      summary: report.summary === null ? null : summary,
      topic: report.topic === null ? null : topic,
      fields: report.fields.map((field, index) => ({ ...field, value: fieldValues[index] })),
    };
  }

  private toExtraLines(texts: string[], firstPosition: number): TranscriptLine[] {
    return texts.map((text, index) => ({ position: firstPosition + index, speaker: Speaker.agent, text, secondsFromStart: 0 }));
  }
}
