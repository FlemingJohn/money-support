import type { ServiceState } from "./ServiceState";

export interface ServiceHealth {
  name: string;
  state: ServiceState;
  latencyMilliseconds: number | null;
}
