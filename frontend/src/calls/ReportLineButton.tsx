"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { ReportLineForm } from "@/calls/ReportLineForm";
import { sendToBackend } from "@/lib/sendToBackend";
import type { ReportLineButtonProps } from "@/types/ReportLineButtonProps";
import type { ReportState } from "@/types/ReportState";
import type { UnmaskedReportResult } from "@/types/UnmaskedReportResult";

const doneMessages: Partial<Record<ReportState, string>> = {
  masked: "Masked, and the summary and fields were checked again",
  hidden: "Nothing specific found, so the line is hidden",
};

export function ReportLineButton({ callId, messageId, lineText }: ReportLineButtonProps) {
  const router = useRouter();
  const [reportState, setReportState] = useState<ReportState>("closed");

  async function report(selectedText: string, kind: string) {
    setReportState("sending");
    try {
      const result = await sendToBackend<UnmaskedReportResult>("POST", `/calls/${encodeURIComponent(callId)}/unmasked-reports`, { messageId, selectedText, kind });
      setReportState(result.outcome);
      router.refresh();
    } catch {
      setReportState("failed");
    }
  }

  const doneMessage = doneMessages[reportState];
  if (doneMessage) {
    return (
      <span role="status" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-success-ink">
        <Check size={14} strokeWidth={2.2} aria-hidden="true" />
        {doneMessage}
      </span>
    );
  }
  if (reportState === "open" || reportState === "sending") {
    return <ReportLineForm lineText={lineText} isSending={reportState === "sending"} onReport={report} onCancel={() => setReportState("closed")} />;
  }

  return (
    <button
      type="button"
      onClick={() => setReportState("open")}
      title="Report personal data in this line"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-xs font-semibold text-ink-muted hover:bg-surface hover:text-ink"
    >
      <TriangleAlert size={14} strokeWidth={2} aria-hidden="true" />
      {reportState === "failed" ? "Try again" : "Report personal data"}
    </button>
  );
}
