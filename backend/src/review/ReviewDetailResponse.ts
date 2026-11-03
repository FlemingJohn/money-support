import type { CallDetailResponse } from "../calls/CallDetailResponse";
import type { ReviewResponse } from "./ReviewResponse";

export interface ReviewDetailResponse {
  review: ReviewResponse;
  call: CallDetailResponse;
}
