import type { PrivacySettings } from "@/types/PrivacySettings";

export interface PrivacyToggle {
  key: keyof Omit<PrivacySettings, "transcriptRetentionDays">;
  label: string;
  detail: string;
}
