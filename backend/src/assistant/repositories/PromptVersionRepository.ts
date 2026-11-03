import { Injectable } from "@nestjs/common";
import type { PromptVersion } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";

@Injectable()
export class PromptVersionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findCurrent(): Promise<PromptVersion | null> {
    return this.prismaService.promptVersion.findFirst({ where: { isCurrent: true } });
  }

  async saveCurrent(contentHash: string, content: string): Promise<PromptVersion> {
    return this.prismaService.$transaction(async (transaction) => {
      await transaction.promptVersion.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
      return transaction.promptVersion.upsert({
        where: { contentHash },
        create: { contentHash, content, isCurrent: true },
        update: { isCurrent: true },
      });
    });
  }
}
