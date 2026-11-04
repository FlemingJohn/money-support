import type { Callback } from "@/types/Callback";

export interface CallbackLiveStepProps {
  callback: Callback;
  errorMessage: string;
  onEnd: () => void;
}
