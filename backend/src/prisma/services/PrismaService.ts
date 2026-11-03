import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(appConfiguration: AppConfiguration) {
    super({ adapter: new PrismaPg(PrismaService.makePoolConfiguration(appConfiguration)) });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  private static makePoolConfiguration(appConfiguration: AppConfiguration): PoolConfig {
    const connectionString = appConfiguration.databaseUrl;
    if (!appConfiguration.hasDatabaseCaCertificate) return { connectionString };
    return { connectionString, ssl: { ca: appConfiguration.databaseCaCertificate } };
  }
}
