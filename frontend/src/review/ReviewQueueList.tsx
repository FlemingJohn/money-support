import Link from "next/link";
import { ArrowLeftRight, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { IconTile } from "@/components/IconTile";
import { formatClockTime } from "@/lib/formatClockTime";
import { reviewReasonLabels } from "@/lib/reviewReasonLabels";
import { makeReviewPath } from "@/review/makeReviewPath";
import type { ReviewQueueListProps } from "@/types/ReviewQueueListProps";

export function ReviewQueueList({ reviews, selection, selectedCallId }: ReviewQueueListProps) {
  if (reviews.length === 0) return <EmptyState message="Nothing in this list." />;

  return (
    <ul className="flex flex-col">
      {reviews.map((review) => {
        const isSelected = review.callId === selectedCallId;
        return (
          <li key={review.callId} className="border-b border-line-soft last:border-b-0">
            <Link
              href={makeReviewPath({ status: selection.status, callId: review.callId })}
              aria-current={isSelected ? "true" : undefined}
              className={`flex min-h-17 items-center gap-3 px-4 text-ink ${isSelected ? "bg-yellow-wash" : "hover:bg-surface"}`}
            >
              <IconTile
                icon={review.hasRemovedData ? ShieldCheck : ArrowLeftRight}
                className={review.hasRemovedData ? "bg-redacted-wash text-redacted-ink" : "bg-handoff-wash text-handoff-ink"}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{review.topic}</span>
                <span className="truncate text-[13px] text-ink-muted">
                  {reviewReasonLabels[review.reason]} · <span className="font-mono">{formatClockTime(review.startedAt)}</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
