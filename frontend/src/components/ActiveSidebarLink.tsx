"use client";

import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { isActivePath } from "@/lib/isActivePath";
import type { ActiveSidebarLinkProps } from "@/types/ActiveSidebarLinkProps";

export function ActiveSidebarLink({ item, isCollapsed }: ActiveSidebarLinkProps) {
  const pathname = usePathname();
  return <SidebarLink item={item} isCollapsed={isCollapsed} isActive={isActivePath(pathname, item.href)} />;
}
