import type { CallbackStatus } from "@/types/CallbackStatus";

export interface CallbackStep {
  status: CallbackStatus;
  label: string;
}
