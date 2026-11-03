import type { RedactedLine } from "../guardrails/RedactedLine";
import type { ReportedField } from "./ReportedField";

export interface RedactedReport {
  lines: RedactedLine[];
  summary: string | null;
  topic: string | null;
  fields: ReportedField[];
}
