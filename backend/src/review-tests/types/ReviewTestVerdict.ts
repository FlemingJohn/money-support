import type { VerdictReason } from "../../generated/prisma/client";

export interface ReviewTestVerdict {
  verdictReason: VerdictReason;
  expectedBehaviour: string | null;
  verdictMessageId: string | null;
}
