import type { VerdictReason } from "../../generated/prisma/client";

export interface QualityReasonCount {
  reason: VerdictReason;
  count: number;
}
