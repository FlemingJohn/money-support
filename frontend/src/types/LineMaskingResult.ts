export interface LineMaskingResult {
  status: "partial" | "checked" | "failed";
  redactedText: string;
}
