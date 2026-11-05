import type { CallMessage } from "@/types/CallMessage";
import type { Review } from "@/types/Review";

export interface VerdictFormProps {
  review: Review;
  agentReplies: CallMessage[];
  nextReviewPath: string | null;
}
