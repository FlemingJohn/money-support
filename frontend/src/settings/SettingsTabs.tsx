import Link from "next/link";
import { settingsTabLinks } from "@/settings/settingsTabLinks";
import type { SettingsTabsProps } from "@/types/SettingsTabsProps";

export function SettingsTabs({ currentTab }: SettingsTabsProps) {
  return (
    <nav aria-label="Settings sections" className="flex flex-wrap gap-1 rounded-card border border-line bg-paper p-1">
      {settingsTabLinks.map(({ tab, label, icon: Icon }) => {
        const isCurrent = tab === currentTab;
        return (
          <Link
            key={tab}
            href={`/settings?tab=${tab}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-control px-3.5 text-sm font-semibold text-ink ${isCurrent ? "bg-yellow-soft" : "hover:bg-surface"}`}
          >
            <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
