import type { CallMessageResponse } from "./CallMessageResponse";
import type { CallReviewResponse } from "./CallReviewResponse";
import type { CallSummaryResponse } from "./CallSummaryResponse";
import type { ExtractedFieldResponse } from "./ExtractedFieldResponse";
import type { GuardrailEventResponse } from "./GuardrailEventResponse";
import type { MatchedFaqResponse } from "./MatchedFaqResponse";

export interface CallDetailResponse extends CallSummaryResponse {
  summary: string | null;
  endedReason: string | null;
  promptVersionId: string | null;
  matchedFaq: MatchedFaqResponse | null;
  messages: CallMessageResponse[];
  extractedFields: ExtractedFieldResponse[];
  guardrailEvents: GuardrailEventResponse[];
  review: CallReviewResponse | null;
  customerNumber: string | null;
}
