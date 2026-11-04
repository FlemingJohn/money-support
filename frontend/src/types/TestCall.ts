import type { LiveLine } from "@/types/LiveLine";
import type { TestCallStatus } from "@/types/TestCallStatus";

export interface TestCall {
  status: TestCallStatus;
  lines: LiveLine[];
  isMuted: boolean;
  volume: number;
  seconds: number;
  errorMessage: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  toggleMute: () => void;
}
