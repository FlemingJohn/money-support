"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarLink } from "@/components/SidebarLink";
import { useSidebarState } from "@/hooks/useSidebarState";
import { LogoMark } from "@/icons/LogoMark";
import { mainNavigationItems } from "@/navigation/mainNavigationItems";
import { settingsNavigationItem } from "@/navigation/settingsNavigationItem";

export function AppSidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;
  const toggleLabel = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
  const width = isCollapsed ? "w-19" : "w-62 max-md:w-19";

  return (
    <aside className={`sticky top-0 flex h-screen shrink-0 flex-col gap-7 border-r border-line bg-paper px-3 py-5 ${width}`}>
      <Link href="/" aria-label="Money Support home" className="flex min-h-11 items-center gap-2.5 px-1.5 text-ink">
        <LogoMark />
        {!isCollapsed && <span className="whitespace-nowrap text-base font-bold max-md:hidden">Money Support</span>}
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {mainNavigationItems.map((item) => (
          <SidebarLink key={item.href} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-line-soft pt-4">
        <SidebarLink item={settingsNavigationItem} isCollapsed={isCollapsed} />
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          title={toggleLabel}
          className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold text-ink-muted hover:bg-surface max-md:hidden"
        >
          <ToggleIcon size={20} strokeWidth={1.75} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
