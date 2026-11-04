import type { ReportedField } from "./ReportedField";

export interface StructuredCallData {
  topic: string | null;
  matchedFaqNumber: number | null;
  isHandedOff: boolean | null;
  fields: ReportedField[];
}
