import type { PhoneSettings } from "@/types/PhoneSettings";
import type { RingPhone } from "@/types/RingPhone";

export interface CallbackConfirmStepProps {
  callerLabel: string;
  phone: PhoneSettings;
  errorMessage: string;
  onStart: (ringPhone: RingPhone) => void;
  onClose: () => void;
}
