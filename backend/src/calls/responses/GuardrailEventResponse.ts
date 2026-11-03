import type { GuardrailKind } from "../../generated/prisma/client";

export interface GuardrailEventResponse {
  id: string;
  kind: GuardrailKind;
  entityType: string;
  createdAt: string;
}
