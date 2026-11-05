import { ClipboardCheck } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { CallbackHistory } from "@/review/CallbackHistory";
import { ReviewNoteForm } from "@/review/ReviewNoteForm";
import { ReviewStatusButtons } from "@/review/ReviewStatusButtons";
import { VerdictForm } from "@/review/VerdictForm";
import type { ReviewActionsCardProps } from "@/types/ReviewActionsCardProps";

export function ReviewActionsCard({ review, callbacks, agentReplies, nextReviewPath }: ReviewActionsCardProps) {
  return (
    <SectionCard title="Review" icon={ClipboardCheck}>
      <div className="flex flex-col gap-4 p-5">
        <VerdictForm key={`${review.verdict}-${review.verdictReason}-${review.verdictMessageId}`} review={review} agentReplies={agentReplies} nextReviewPath={nextReviewPath} />
        <CallbackHistory callbacks={callbacks} />
        <ReviewNoteForm key={review.note} review={review} />
        <ReviewStatusButtons review={review} />
      </div>
    </SectionCard>
  );
}
