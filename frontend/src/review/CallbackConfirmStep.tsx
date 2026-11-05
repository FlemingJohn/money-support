"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { makePhoneChoices } from "@/review/makePhoneChoices";
import type { CallbackConfirmStepProps } from "@/types/CallbackConfirmStepProps";
import type { RingPhone } from "@/types/RingPhone";

export function CallbackConfirmStep({ callerLabel, phone, errorMessage, onStart, onClose }: CallbackConfirmStepProps) {
  const phoneChoices = makePhoneChoices(phone);
  const [ringPhone, setRingPhone] = useState<RingPhone>(phoneChoices[0]?.value ?? "desk");

  return (
    <>
      <p className="text-sm leading-relaxed">
        We ring your phone first, then connect you to the caller on <strong className="font-mono">{callerLabel}</strong>.
      </p>
      {phoneChoices.length === 0 ? (
        <p className="rounded-control bg-handoff-wash px-3 py-2 text-sm text-handoff-ink">Add your desk or mobile number in Settings → Phone first.</p>
      ) : (
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ring this phone
          <select
            value={ringPhone}
            onChange={(event) => setRingPhone(event.target.value as RingPhone)}
            className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal"
          >
            {phoneChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="min-h-11 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onStart(ringPhone)}
          disabled={phoneChoices.length === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-40"
        >
          <PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
          Call
        </button>
      </div>
    </>
  );
}
