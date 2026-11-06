export interface UnmaskedReportResult {
  text: string;
  outcome: "masked" | "unchanged";
  isReanalysed: boolean;
}
