import type { CallMessage } from "@/types/CallMessage";
import type { Callback } from "@/types/Callback";
import type { Review } from "@/types/Review";

export interface ReviewActionsCardProps {
  review: Review;
  callbacks: Callback[];
  agentReplies: CallMessage[];
}
