export interface ServiceCheck {
  name: string;
  state: "up" | "down" | "notConfigured";
  latencyMilliseconds: number | null;
}
