export interface SuggestionResult {
  ruleText: string;
  explanation: string;
  reviewCallIds: string[];
  passedBefore: number;
  passedAfter: number;
  totalTests: number;
  isBetter: boolean;
}
