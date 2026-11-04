import { Check } from "lucide-react";
import type { CallbackLiveStepProps } from "@/types/CallbackLiveStepProps";
import type { CallbackStep } from "@/types/CallbackStep";

const steps: CallbackStep[] = [
  { status: "ringingReviewer", label: "Ringing your phone" },
  { status: "ringingCaller", label: "Ringing the caller" },
  { status: "connected", label: "Connected" },
];

export function CallbackLiveStep({ callback, errorMessage, onEnd }: CallbackLiveStepProps) {
  const currentIndex = steps.findIndex((step) => step.status === callback.status);

  return (
    <>
      <ol className="flex flex-col gap-2.5" aria-live="polite">
        {steps.map((step, index) => (
          <li key={step.status} className={`flex items-center gap-2.5 text-sm ${index <= currentIndex ? "font-semibold text-ink" : "text-ink-muted"}`}>
            <span className={`grid size-6 place-items-center rounded-full ${index < currentIndex ? "bg-success text-paper" : index === currentIndex ? "bg-yellow" : "bg-sand"}`}>
              {index < currentIndex && <Check size={14} strokeWidth={2.4} aria-hidden="true" />}
            </span>
            {step.label}
          </li>
        ))}
      </ol>
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
      <button type="button" onClick={onEnd} className="min-h-11 rounded-control bg-handoff-ink px-4 text-sm font-semibold text-paper">
        End call
      </button>
    </>
  );
}
