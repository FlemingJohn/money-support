import { getFromBackend } from "@/lib/getFromBackend";
import type { QualityStatistics } from "@/types/QualityStatistics";

export function getQuality(): Promise<QualityStatistics> {
  return getFromBackend<QualityStatistics>("/overview/quality");
}
