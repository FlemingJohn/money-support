import type { ReactNode } from "react";

export interface PageLinkProps {
  href: string;
  label: string;
  isEnabled: boolean;
  children: ReactNode;
}
