export interface UnmaskedReportResponse {
  text: string;
  outcome: "masked" | "unchanged";
  isReanalysed: boolean;
}
