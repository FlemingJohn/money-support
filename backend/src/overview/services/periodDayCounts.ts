import type { OverviewPeriod } from "../types/OverviewPeriod";

export const periodDayCounts: Record<OverviewPeriod, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
};
