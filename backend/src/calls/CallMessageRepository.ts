import { Injectable } from "@nestjs/common";
import type { CallMessage } from "../generated/prisma/client";
import type { RedactedLine } from "../guardrails/RedactedLine";
import type { DatabaseTransaction } from "../prisma/DatabaseTransaction";
import { PrismaService } from "../prisma/PrismaService";

@Injectable()
export class CallMessageRepository {
  private readonly hiddenMessageText = "[message hidden while it is reviewed]";

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

  findById(messageId: string): Promise<CallMessage | null> {
    return this.prismaService.callMessage.findUnique({ where: { id: messageId } });
  }

  async hide(transaction: DatabaseTransaction, messageId: string): Promise<void> {
    await transaction.callMessage.update({ where: { id: messageId }, data: { redactedText: this.hiddenMessageText } });
  }

  async deleteForCallsEndedBefore(cutoff: Date): Promise<number> {
    const result = await this.prismaService.callMessage.deleteMany({ where: { call: { endedAt: { lt: cutoff } } } });
    return result.count;
  }
}
