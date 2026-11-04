import { formatDuration } from "@/lib/formatDuration";
import type { CallbackEndedStepProps } from "@/types/CallbackEndedStepProps";

export function CallbackEndedStep({ callback, onClose }: CallbackEndedStepProps) {
  const isFailed = callback.status === "failed";

  return (
    <>
      <p role="status" className="text-sm">
        {isFailed ? "The call back did not connect." : `Call ended · ${formatDuration(callback.durationSeconds)}`}
      </p>
      <button type="button" onClick={onClose} className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted">
        Done
      </button>
    </>
  );
}
