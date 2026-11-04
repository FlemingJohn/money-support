"use client";

import { useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { sendToBackend } from "@/lib/sendToBackend";
import type { ReportLineButtonProps } from "@/types/ReportLineButtonProps";
import type { ReportState } from "@/types/ReportState";

export function ReportLineButton({ callId, messageId }: ReportLineButtonProps) {
  const [reportState, setReportState] = useState<ReportState>("idle");

  async function report() {
    setReportState("sending");
    try {
      await sendToBackend("POST", `/calls/${encodeURIComponent(callId)}/unmasked-reports`, { messageId });
      setReportState("sent");
    } catch {
      setReportState("failed");
    }
  }

  if (reportState === "sent") {
    return (
      <span role="status" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-success-ink">
        <Check size={14} strokeWidth={2.2} aria-hidden="true" />
        Reported
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={report}
      disabled={reportState === "sending"}
      title="Report personal data in this line"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-xs font-semibold text-ink-muted hover:bg-surface hover:text-ink disabled:opacity-50"
    >
      <TriangleAlert size={14} strokeWidth={2} aria-hidden="true" />
      {reportState === "failed" ? "Try again" : "Report personal data"}
    </button>
  );
}
