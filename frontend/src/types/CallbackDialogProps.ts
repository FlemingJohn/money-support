import type { PhoneSettings } from "@/types/PhoneSettings";

export interface CallbackDialogProps {
  callId: string;
  callerLabel: string;
  phone: PhoneSettings;
  onClose: () => void;
}
