import { Injectable } from "@nestjs/common";
import type { Faq } from "../generated/prisma/client";
import { PrismaService } from "../prisma/PrismaService";
import type { FaqInput } from "./FaqInput";

@Injectable()
export class FaqRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<Faq[]> {
    return this.prismaService.faq.findMany({ orderBy: { sortOrder: "asc" } });
  }

  findActive(): Promise<Faq[]> {
    return this.prismaService.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  findById(faqId: string): Promise<Faq | null> {
    return this.prismaService.faq.findUnique({ where: { id: faqId } });
  }

  findByNumber(number: number): Promise<Faq | null> {
    return this.prismaService.faq.findFirst({ where: { sortOrder: number } });
  }

  async create(input: FaqInput): Promise<Faq> {
    const faqCount = await this.prismaService.faq.count();
    return this.prismaService.faq.create({ data: { ...input, sortOrder: faqCount + 1 } });
  }

  update(faqId: string, changes: Partial<FaqInput>): Promise<Faq> {
    return this.prismaService.faq.update({ where: { id: faqId }, data: changes });
  }

  async delete(faqId: string): Promise<void> {
    await this.prismaService.faq.delete({ where: { id: faqId } });
    const remaining = await this.findAll();
    await this.reorder(remaining.map((faq) => faq.id));
  }

  async reorder(faqIds: string[]): Promise<void> {
    await this.prismaService.$transaction(
      faqIds.map((faqId, index) => this.prismaService.faq.update({ where: { id: faqId }, data: { sortOrder: index + 1 } })),
    );
  }
}
