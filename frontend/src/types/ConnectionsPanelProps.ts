import type { HealthReport } from "@/types/HealthReport";

export interface ConnectionsPanelProps {
  health: HealthReport;
  webhookUrl: string;
}
