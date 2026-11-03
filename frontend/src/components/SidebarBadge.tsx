import type { SidebarBadgeProps } from "@/types/SidebarBadgeProps";

export function SidebarBadge({ count, isCollapsed }: SidebarBadgeProps) {
  const placement = isCollapsed
    ? "absolute top-1.5 right-2 h-4 min-w-4 text-[10px]"
    : "ml-auto h-5.5 min-w-5.5 text-xs max-md:absolute max-md:top-1.5 max-md:right-2 max-md:h-4 max-md:min-w-4 max-md:text-[10px]";

  return (
    <span aria-hidden="true" className={`grid place-items-center rounded-full bg-ink px-1.5 font-bold text-paper ${placement}`}>
      {count}
    </span>
  );
}
