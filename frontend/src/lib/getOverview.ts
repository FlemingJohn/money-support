import { getFromBackend } from "@/lib/getFromBackend";
import type { Overview } from "@/types/Overview";
import type { OverviewPeriod } from "@/types/OverviewPeriod";

export function getOverview(period: OverviewPeriod): Promise<Overview> {
  return getFromBackend<Overview>(`/overview?period=${period}`);
}
