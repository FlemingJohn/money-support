import { Suspense } from "react";
import { ActiveSidebarLink } from "@/components/ActiveSidebarLink";
import { SidebarLink } from "@/components/SidebarLink";
import type { ActiveSidebarLinkProps } from "@/types/ActiveSidebarLinkProps";

export function SidebarNavigationLink({ item, isCollapsed }: ActiveSidebarLinkProps) {
  return (
    <Suspense fallback={<SidebarLink item={item} isCollapsed={isCollapsed} isActive={false} />}>
      <ActiveSidebarLink item={item} isCollapsed={isCollapsed} />
    </Suspense>
  );
}
