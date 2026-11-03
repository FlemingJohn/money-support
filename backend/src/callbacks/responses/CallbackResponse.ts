import type { CallbackStatus } from "../../generated/prisma/client";

export interface CallbackResponse {
  id: string;
  callId: string;
  ringPhone: string;
  status: CallbackStatus;
  startedAt: string;
  connectedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
}
