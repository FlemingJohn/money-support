import type { Callback } from "@/types/Callback";
import type { RingPhone } from "@/types/RingPhone";

export interface CallbackProgress {
  callback: Callback | null;
  errorMessage: string;
  start: (ringPhone: RingPhone) => Promise<void>;
  end: () => Promise<void>;
}
