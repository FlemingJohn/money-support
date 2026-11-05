export interface ReportDecision {
  text: string;
  kinds: string[];
  outcome: "masked" | "hidden";
}
