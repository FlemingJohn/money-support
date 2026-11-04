import type { CallbackStatus } from "@/types/CallbackStatus";
import type { RingPhone } from "@/types/RingPhone";

export interface Callback {
  id: string;
  callId: string;
  ringPhone: RingPhone;
  status: CallbackStatus;
  startedAt: string;
  connectedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
}
