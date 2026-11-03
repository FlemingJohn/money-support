import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}
