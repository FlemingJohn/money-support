import type { LucideIcon } from "lucide-react";
import type { StatTone } from "@/types/StatTone";
import type { TrendDirection } from "@/types/TrendDirection";

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  detail: string;
  tone: StatTone;
  trend?: TrendDirection;
  progress?: number;
  isMonospace?: boolean;
}
