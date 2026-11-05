export interface UnmaskedReportResponse {
  text: string;
  outcome: "masked" | "hidden";
  isReanalysed: boolean;
}
