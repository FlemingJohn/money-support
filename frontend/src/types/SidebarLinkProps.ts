import type { NavigationItem } from "@/types/NavigationItem";

export interface SidebarLinkProps {
  item: NavigationItem;
  isCollapsed: boolean;
  isActive: boolean;
}
