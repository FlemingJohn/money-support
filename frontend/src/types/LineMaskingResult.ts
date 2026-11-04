export interface LineMaskingResult {
  status: "checking" | "checked" | "failed";
  redactedText: string;
}
