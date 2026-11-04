import type { SavingState } from "@/types/SavingState";

export interface SettingsForm<Values> {
  values: Values;
  hasChanged: boolean;
  savingState: SavingState;
  errorMessage: string;
  change: (changes: Partial<Values>) => void;
  reset: () => void;
  save: () => Promise<void>;
}
