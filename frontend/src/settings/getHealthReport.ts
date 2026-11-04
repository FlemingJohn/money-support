import { getFromBackend } from "@/lib/getFromBackend";
import type { HealthReport } from "@/types/HealthReport";

export function getHealthReport(): Promise<HealthReport> {
  return getFromBackend<HealthReport>("/health");
}
