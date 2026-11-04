import type { LucideIcon } from "lucide-react";

export interface FactTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isMonospace?: boolean;
}
