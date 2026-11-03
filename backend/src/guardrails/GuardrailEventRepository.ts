import { Injectable } from "@nestjs/common";
import { GuardrailKind } from "../generated/prisma/client";
import type { DatabaseTransaction } from "../prisma/DatabaseTransaction";
import type { GuardrailEventInput } from "./GuardrailEventInput";

@Injectable()
export class GuardrailEventRepository {
  async replaceRemovedDataEvents(transaction: DatabaseTransaction, callId: string, events: GuardrailEventInput[]): Promise<void> {
    await transaction.guardrailEvent.deleteMany({ where: { callId, kind: GuardrailKind.personalDataRemoved } });
    await transaction.guardrailEvent.createMany({ data: events.map((event) => ({ ...event, callId })) });
  }

  async addEvent(transaction: DatabaseTransaction, callId: string, event: GuardrailEventInput): Promise<void> {
    await transaction.guardrailEvent.create({ data: { ...event, callId } });
  }
}
