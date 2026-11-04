import type { PhoneSettings } from "@/types/PhoneSettings";

export interface CallbackButtonProps {
  callId: string;
  callerLabel: string;
  phone: PhoneSettings;
}
