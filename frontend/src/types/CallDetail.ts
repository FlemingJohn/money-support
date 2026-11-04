import type { CallMessage } from "@/types/CallMessage";
import type { CallReview } from "@/types/CallReview";
import type { CallSummary } from "@/types/CallSummary";
import type { ExtractedField } from "@/types/ExtractedField";
import type { GuardrailEvent } from "@/types/GuardrailEvent";
import type { MatchedFaq } from "@/types/MatchedFaq";

export interface CallDetail extends CallSummary {
  summary: string | null;
  endedReason: string | null;
  promptVersionId: string | null;
  matchedFaq: MatchedFaq | null;
  messages: CallMessage[];
  extractedFields: ExtractedField[];
  guardrailEvents: GuardrailEvent[];
  review: CallReview | null;
}
