import Link from "next/link";
import { SidebarBadge } from "@/components/SidebarBadge";
import type { SidebarLinkProps } from "@/types/SidebarLinkProps";

export function SidebarLink({ item, isCollapsed, isActive }: SidebarLinkProps) {
  const Icon = item.icon;
  const background = isActive ? "bg-yellow-soft" : "hover:bg-surface";
  const accessibleName = item.badgeCount ? `${item.label}, ${item.badgeCount} waiting` : item.label;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      aria-label={accessibleName}
      title={item.label}
      className={`relative flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold text-ink ${background}`}
    >
      <Icon size={20} strokeWidth={1.75} className="shrink-0" />
      {!isCollapsed && <span className="whitespace-nowrap max-md:hidden">{item.label}</span>}
      {item.badgeCount ? <SidebarBadge count={item.badgeCount} isCollapsed={isCollapsed} /> : null}
    </Link>
  );
}
