"use client";

import { useState } from "react";
import { reportKindOptions } from "@/calls/reportKindOptions";
import type { ReportLineFormProps } from "@/types/ReportLineFormProps";

const controlLook = "min-h-10 rounded-control border border-line bg-paper px-2.5 text-sm";

export function ReportLineForm({ isSending, onReport, onCancel }: ReportLineFormProps) {
  const [selectedText, setSelectedText] = useState("");
  const [kind, setKind] = useState(reportKindOptions[2]);

  return (
    <div className="mt-1 flex w-full flex-col gap-2 rounded-card border border-line-soft bg-surface p-3 text-sm">
      <p className="text-ink-muted">We check this line again and mask only the personal data. If nothing is found, type the leaked words below.</p>
      <div className="flex flex-wrap gap-2">
        <input aria-label="Leaked words" value={selectedText} onChange={(event) => setSelectedText(event.target.value)} placeholder="Leaked words (optional)" maxLength={200} className={`${controlLook} min-w-0 flex-[1_1_180px]`} />
        <select aria-label="Kind of personal data" value={kind} onChange={(event) => setKind(event.target.value)} className={controlLook}>
          {reportKindOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="min-h-10 rounded-control px-3 font-semibold hover:bg-paper">
          Cancel
        </button>
        <button type="button" onClick={() => onReport(selectedText.trim(), kind)} disabled={isSending} className="min-h-10 rounded-control bg-ink px-3 font-semibold text-paper hover:bg-ink-muted disabled:opacity-50">
          {isSending ? "Checking…" : "Report and mask"}
        </button>
      </div>
    </div>
  );
}
