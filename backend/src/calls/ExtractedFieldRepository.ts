import { Injectable } from "@nestjs/common";
import type { DatabaseTransaction } from "../prisma/DatabaseTransaction";
import { PrismaService } from "../prisma/PrismaService";
import type { LocatedField } from "./LocatedField";

@Injectable()
export class ExtractedFieldRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async replaceForCall(transaction: DatabaseTransaction, callId: string, fields: LocatedField[]): Promise<void> {
    await transaction.extractedField.deleteMany({ where: { callId } });
    await transaction.extractedField.createMany({ data: fields.map((field) => ({ ...field, callId })) });
  }

  async confirmAllForCall(callId: string): Promise<void> {
    await this.prismaService.extractedField.updateMany({ where: { callId }, data: { isConfirmed: true } });
  }

  async deleteForCallsEndedBefore(cutoff: Date): Promise<number> {
    const result = await this.prismaService.extractedField.deleteMany({ where: { call: { endedAt: { lt: cutoff } } } });
    return result.count;
  }
}
