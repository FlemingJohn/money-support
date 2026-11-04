"use client";

import { X } from "lucide-react";
import { useCallbackProgress } from "@/hooks/useCallbackProgress";
import { CallbackConfirmStep } from "@/review/CallbackConfirmStep";
import { CallbackEndedStep } from "@/review/CallbackEndedStep";
import { CallbackLiveStep } from "@/review/CallbackLiveStep";
import type { CallbackDialogProps } from "@/types/CallbackDialogProps";

export function CallbackDialog({ callId, callerLabel, phone, onClose }: CallbackDialogProps) {
  const { callback, errorMessage, start, end } = useCallbackProgress(callId);
  const isFinished = callback?.status === "ended" || callback?.status === "failed";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="callback-title" className="flex w-full max-w-md flex-col gap-4 rounded-card bg-paper p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 id="callback-title" className="text-lg font-bold">
            Call back
          </h2>
          {(!callback || isFinished) && (
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-control text-ink-muted hover:bg-surface">
              <X size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </header>
        {!callback && <CallbackConfirmStep callerLabel={callerLabel} phone={phone} errorMessage={errorMessage} onStart={start} onClose={onClose} />}
        {callback && !isFinished && <CallbackLiveStep callback={callback} errorMessage={errorMessage} onEnd={end} />}
        {callback && isFinished && <CallbackEndedStep callback={callback} onClose={onClose} />}
      </section>
    </div>
  );
}
