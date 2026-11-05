import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { verdictReasonLabels } from "@/lib/verdictReasonLabels";
import type { VerdictSummaryProps } from "@/types/VerdictSummaryProps";

export function VerdictSummary({ review, nextReviewPath, onChange }: VerdictSummaryProps) {
  const isWrong = review.verdict === "wrong";

  return (
    <div role="status" className={`flex flex-wrap items-center gap-3 rounded-card border p-3 text-sm ${isWrong ? "border-handoff-wash bg-handoff-wash" : "border-success-wash bg-success-wash"}`}>
      <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" className="fill-paper" />
        {isWrong ? <path d="M7.5 7.5 L14.5 14.5 M14.5 7.5 L7.5 14.5" className="stroke-handoff-ink" strokeWidth="2.2" strokeLinecap="round" /> : <path d="M6.5 11.5 L9.5 14.5 L15.5 8" fill="none" className="stroke-success" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <span className="min-w-0 flex-[1_1_200px]">
        <strong>{isWrong ? "Wrong" : "Correct"}</strong>
        {isWrong && review.verdictReason ? ` · ${verdictReasonLabels[review.verdictReason]}` : ""}
        {review.reviewTestNumber !== null && (
          <Link href="/agent-quality?tab=tests" className="ml-2 inline-flex items-center gap-1 font-semibold text-ink hover:underline">
            <FlaskConical size={14} strokeWidth={2} aria-hidden="true" />
            R{String(review.reviewTestNumber).padStart(2, "0")}
          </Link>
        )}
      </span>
      <button type="button" onClick={onChange} className="min-h-10 rounded-control px-3 font-semibold hover:bg-paper">
        Change
      </button>
      {nextReviewPath && (
        <Link href={nextReviewPath} className="inline-flex min-h-10 items-center gap-1.5 rounded-control bg-ink px-3 font-semibold text-paper hover:bg-ink-muted">
          Next review
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
