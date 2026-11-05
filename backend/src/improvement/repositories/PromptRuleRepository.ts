import { Injectable } from "@nestjs/common";
import type { PromptRule } from "../../generated/prisma/client";
import type { DatabaseTransaction } from "../../prisma/types/DatabaseTransaction";
import { PrismaService } from "../../prisma/services/PrismaService";

@Injectable()
export class PromptRuleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<PromptRule[]> {
    return this.prismaService.promptRule.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findEnabledTexts(): Promise<string[]> {
    const rules = await this.prismaService.promptRule.findMany({ where: { isEnabled: true }, orderBy: { createdAt: "asc" } });
    return rules.map((rule) => rule.ruleText);
  }

  create(transaction: DatabaseTransaction, ruleText: string, suggestionId: string): Promise<PromptRule> {
    return transaction.promptRule.create({ data: { ruleText, suggestionId } });
  }

  setEnabled(id: string, isEnabled: boolean): Promise<PromptRule> {
    return this.prismaService.promptRule.update({ where: { id }, data: { isEnabled } });
  }

  async setAddedInVersion(id: string, promptVersionId: string | null): Promise<void> {
    await this.prismaService.promptRule.update({ where: { id }, data: { addedInVersionId: promptVersionId } });
  }
}
