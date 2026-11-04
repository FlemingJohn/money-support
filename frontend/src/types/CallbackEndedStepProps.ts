import type { Callback } from "@/types/Callback";

export interface CallbackEndedStepProps {
  callback: Callback;
  onClose: () => void;
}
