import type { ReviewReason } from "../../generated/prisma/client";

export interface TriageFacts {
  isHandedOff: boolean;
  removedEntityCount: number;
  uncheckedLineCount: number;
  fieldConfidences: number[];
  suggestedReason: ReviewReason | null;
}
