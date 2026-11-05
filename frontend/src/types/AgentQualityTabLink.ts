import type { LucideIcon } from "lucide-react";
import type { AgentQualityTab } from "@/types/AgentQualityTab";

export interface AgentQualityTabLink {
  tab: AgentQualityTab;
  label: string;
  icon: LucideIcon;
}
