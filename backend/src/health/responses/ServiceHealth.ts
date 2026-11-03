import type { ServiceState } from "../types/ServiceState";

export interface ServiceHealth {
  name: string;
  state: ServiceState;
  latencyMilliseconds: number | null;
}
