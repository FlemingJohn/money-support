import { Clock, Mail } from "lucide-react";
import { toCallRow } from "@/calls/toCallRow";
import { CallerLabel } from "@/components/CallerLabel";
import { formatClockTime } from "@/lib/formatClockTime";
import { formatDuration } from "@/lib/formatDuration";
import { reviewReasonLabels } from "@/lib/reviewReasonLabels";
import { reviewStatusLabels } from "@/lib/reviewStatusLabels";
import { CallbackButton } from "@/review/CallbackButton";
import type { ReviewHeaderProps } from "@/types/ReviewHeaderProps";

export function ReviewHeader({ detail, phone }: ReviewHeaderProps) {
  const { review, call } = detail;
  const isPhoneCall = call.channel === "phone";

  return (
    <section className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-paper px-5 py-4">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
        <h2 className="text-xl font-bold wrap-anywhere">{call.topic}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-muted">
          <span className="rounded-full bg-sand px-2.5 py-0.5 font-semibold text-ink">{reviewStatusLabels[review.status]}</span>
          <span>{reviewReasonLabels[review.reason]}</span>
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Clock size={14} strokeWidth={1.9} aria-hidden="true" />
            {formatClockTime(call.startedAt)} · {formatDuration(call.durationSeconds)}
          </span>
          <CallerLabel call={toCallRow(call)} />
          {review.handOffEmailedAt && (
            <span className="inline-flex items-center gap-1.5">
              <Mail size={14} strokeWidth={1.9} aria-hidden="true" />
              Emailed the team at <span className="font-mono">{formatClockTime(review.handOffEmailedAt)}</span>
            </span>
          )}
        </div>
      </div>
      {isPhoneCall ? (
        <CallbackButton callId={call.id} callerLabel={call.callerLabel} phone={phone} />
      ) : (
        <span className="text-[13px] text-ink-muted">Web call · no number to call back</span>
      )}
    </section>
  );
}
