import type { CallChannel } from "@/types/CallChannel";
import type { CallOutcome } from "@/types/CallOutcome";

export interface Call {
  id: string;
  time: string;
  caller: string;
  channel: CallChannel;
  length: string;
  topic: string;
  outcome: CallOutcome | null;
}
