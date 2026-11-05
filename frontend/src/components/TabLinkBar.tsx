import Link from "next/link";
import type { TabLinkBarProps } from "@/types/TabLinkBarProps";

export function TabLinkBar({ label, links }: TabLinkBarProps) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-1 rounded-card border border-line bg-paper p-1">
      {links.map(({ href, label: linkLabel, icon: Icon, isCurrent }) => (
        <Link
          key={href}
          href={href}
          aria-current={isCurrent ? "page" : undefined}
          className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-control px-3.5 text-sm font-semibold text-ink ${isCurrent ? "bg-yellow-soft" : "hover:bg-surface"}`}
        >
          {Icon && <Icon size={16} strokeWidth={1.9} aria-hidden="true" />}
          {linkLabel}
        </Link>
      ))}
    </nav>
  );
}
