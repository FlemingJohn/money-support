import type { SavingState } from "@/types/SavingState";

export interface SettingsFormFooterProps {
  hasChanged: boolean;
  savingState: SavingState;
  errorMessage: string;
  saveLabel: string;
  onReset: () => void;
  onSave: () => void;
}
