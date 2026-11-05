import { Injectable } from "@nestjs/common";
import type { CallMessage } from "../../generated/prisma/client";
import type { RedactedLine } from "../../guardrails/types/RedactedLine";
import type { DatabaseTransaction } from "../../prisma/types/DatabaseTransaction";
import { PrismaService } from "../../prisma/services/PrismaService";

@Injectable()
export class CallMessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async replaceForCall(transaction: DatabaseTransaction, callId: string, lines: RedactedLine[]): Promise<CallMessage[]> {
    await transaction.callMessage.deleteMany({ where: { callId } });
    return transaction.callMessage.createManyAndReturn({
      data: lines.map((line) => ({
        callId,
        position: line.position,
        speaker: line.speaker,
        redactedText: line.redactedText,
        secondsFromStart: line.secondsFromStart,
      })),
    });
  }

  findForCall(callId: string): Promise<CallMessage[]> {
    return this.prismaService.callMessage.findMany({ where: { callId }, orderBy: { position: "asc" } });
  }

  findById(messageId: string): Promise<CallMessage | null> {
    return this.prismaService.callMessage.findUnique({ where: { id: messageId } });
  }

  async replaceText(transaction: DatabaseTransaction, messageId: string, redactedText: string): Promise<void> {
    await transaction.callMessage.update({ where: { id: messageId }, data: { redactedText } });
  }

  async deleteForCallsEndedBefore(cutoff: Date): Promise<number> {
    const result = await this.prismaService.callMessage.deleteMany({ where: { call: { endedAt: { lt: cutoff } } } });
    return result.count;
  }
}
