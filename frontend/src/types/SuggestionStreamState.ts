import type { SuggestionStep } from "@/types/SuggestionStep";

export interface SuggestionStreamState {
  steps: SuggestionStep[];
  testsDone: number;
  testsTotal: number;
  message: string;
}
