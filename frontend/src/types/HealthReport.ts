import type { ServiceCheck } from "@/types/ServiceCheck";

export interface HealthReport {
  isHealthy: boolean;
  services: ServiceCheck[];
}
