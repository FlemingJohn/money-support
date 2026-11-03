import type { GuardrailKind } from "../generated/prisma/client";

export interface GuardrailEventInput {
  kind: GuardrailKind;
  entityType: string;
}
