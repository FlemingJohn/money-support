import type { LucideIcon } from "lucide-react";
import type { SettingsTab } from "@/types/SettingsTab";

export interface SettingsTabLink {
  tab: SettingsTab;
  label: string;
  icon: LucideIcon;
}
