import { overviewPeriodWordings } from "@/overview/overviewPeriodWordings";
import type { OverviewPeriod } from "@/types/OverviewPeriod";
import type { TabLink } from "@/types/TabLink";

export function makeOverviewPeriodLinks(currentPeriod: OverviewPeriod): TabLink[] {
  return (Object.keys(overviewPeriodWordings) as OverviewPeriod[]).map((period) => ({
    href: `/?period=${period}`,
    label: overviewPeriodWordings[period].tabLabel,
    isCurrent: period === currentPeriod,
  }));
}
