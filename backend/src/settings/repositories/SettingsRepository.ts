import { Injectable } from "@nestjs/common";
import type { Prisma, SettingsSection } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";

@Injectable()
export class SettingsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findValues(section: SettingsSection): Promise<unknown> {
    const setting = await this.prismaService.setting.findUnique({ where: { section } });
    return setting?.values ?? {};
  }

  async saveValues(section: SettingsSection, values: Prisma.InputJsonObject): Promise<void> {
    await this.prismaService.setting.upsert({
      where: { section },
      create: { section, values },
      update: { values },
    });
  }
}
