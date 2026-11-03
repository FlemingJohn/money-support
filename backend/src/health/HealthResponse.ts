import type { ServiceHealth } from "./ServiceHealth";

export interface HealthResponse {
  isHealthy: boolean;
  services: ServiceHealth[];
}
