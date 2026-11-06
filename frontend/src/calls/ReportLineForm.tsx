"use client";

import { useState } from "react";
import { reportKindOptions } from "@/calls/reportKindOptions";
import type { ReportLineFormProps } from "@/types/ReportLineFormProps";

const controlLook = "min-h-10 rounded-control border border-line bg-paper px-2.5 text-sm";

export function ReportLineForm({ lineText, isSending, onReport, onCancel }: ReportLineFormProps) {
  const [selectedText, setSelectedText] = useState("");
  const [kind, setKind] = useState(reportKindOptions[2]);
  const leakedWords = selectedText.trim();
  const isInLine = leakedWords !== "" && lineText.includes(leakedWords);
  const canReport = isInLine && !isSending;

  return (
    <div className="mt-1 flex w-full flex-col gap-2 rounded-card border border-line-soft bg-surface p-3 text-sm">
      <p className="text-ink-muted">Type the leaked words exactly as they appear in the line. Only those words are masked, and the rest of the line stays.</p>
      <div className="flex flex-wrap gap-2">
        <input aria-label="Leaked words" value={selectedText} onChange={(event) => setSelectedText(event.target.value)} placeholder="Leaked words" maxLength={200} className={`${controlLook} min-w-0 flex-[1_1_180px]`} />
        <select aria-label="Kind of personal data" value={kind} onChange={(event) => setKind(event.target.value)} className={controlLook}>
          {reportKindOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {leakedWords !== "" && !isInLine && <p className="text-handoff-ink">Those words are not in this line. Copy them exactly, including capitals.</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="min-h-10 rounded-control px-3 font-semibold hover:bg-paper">
          Cancel
        </button>
        <button type="button" onClick={() => onReport(leakedWords, kind)} disabled={!canReport} className="min-h-10 rounded-control bg-ink px-3 font-semibold text-paper hover:bg-ink-muted disabled:opacity-50">
          {isSending ? "Checking…" : "Report and mask"}
        </button>
      </div>
    </div>
  );
}
