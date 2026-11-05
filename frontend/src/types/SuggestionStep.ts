import type { SuggestionStepStatus } from "@/types/SuggestionStepStatus";

export interface SuggestionStep {
  key: string;
  label: string;
  status: SuggestionStepStatus;
  detail: string;
}
