import type { LucideIcon } from "lucide-react";

export interface TabLink {
  href: string;
  label: string;
  isCurrent: boolean;
  icon?: LucideIcon;
}
