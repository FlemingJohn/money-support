import type { CallDetail } from "@/types/CallDetail";
import type { Review } from "@/types/Review";

export interface ReviewDetail {
  review: Review;
  call: CallDetail;
}
