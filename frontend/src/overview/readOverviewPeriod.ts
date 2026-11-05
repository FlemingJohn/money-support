import type { OverviewPeriod } from "@/types/OverviewPeriod";

const periods: OverviewPeriod[] = ["today", "7d", "30d"];

export function readOverviewPeriod(searchParams: Record<string, string | string[] | undefined>): OverviewPeriod {
  const value = Array.isArray(searchParams.period) ? searchParams.period[0] : searchParams.period;
  return periods.find((period) => period === value) ?? "7d";
}
