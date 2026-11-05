import { Injectable } from "@nestjs/common";
import type { DatabaseTransaction } from "../../prisma/types/DatabaseTransaction";

@Injectable()
export class MaskingMissRepository {
  async recordMisses(transaction: DatabaseTransaction, callId: string, messageId: string, kinds: string[], maskedPattern: string): Promise<void> {
    if (kinds.length === 0) return;
    await transaction.maskingMiss.createMany({ data: kinds.map((kind) => ({ callId, messageId, kind, maskedPattern })) });
  }
}
