export interface UnmaskedReportResult {
  text: string;
  outcome: "masked" | "hidden";
  isReanalysed: boolean;
}
