import Link from "next/link";
import { ArrowLeftRight, ChevronRight, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { IconTile } from "@/components/IconTile";
import type { ReviewPreview } from "@/types/ReviewPreview";
import type { NeedsReviewListProps } from "@/types/NeedsReviewListProps";

export function NeedsReviewList({ reviews }: NeedsReviewListProps) {
  if (reviews.length === 0) return <EmptyState message="Nothing needs review." />;

  return (
    <ul className="flex flex-col">
      {reviews.map((review) => {
        const hasRemovedData = review.hasRemovedData;
        return (
          <li key={review.id} className="border-b border-line-soft last:border-b-0">
            <Link href="/review" className="flex min-h-17 items-center gap-3 px-5 text-ink hover:bg-surface">
              <IconTile
                icon={hasRemovedData ? ShieldCheck : ArrowLeftRight}
                className={hasRemovedData ? "bg-redacted-wash text-redacted-ink" : "bg-handoff-wash text-handoff-ink"}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{review.topic}</span>
                <span className="truncate text-[13px] text-ink-muted">
                  {describeReview(review)} · <span className="font-mono">{review.time}</span>
                </span>
              </span>
              <ChevronRight size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-ink-muted" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const reasonLabels: Record<ReviewPreview["reason"], string> = {
  handOff: "Hand-off",
  guardrail: "Personal data removed",
  lowConfidence: "Unclear detail",
};

function describeReview(review: ReviewPreview): string {
  const label = reasonLabels[review.reason];
  return review.hasRemovedData && review.reason !== "guardrail" ? `${label} and personal data removed` : label;
}
