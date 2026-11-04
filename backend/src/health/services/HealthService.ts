import { Injectable } from "@nestjs/common";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { PrismaService } from "../../prisma/services/PrismaService";
import type { HealthResponse } from "../responses/HealthResponse";
import type { ServiceHealth } from "../responses/ServiceHealth";

@Injectable()
export class HealthService {
  private readonly aiServiceTimeoutMilliseconds = 10_000;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfiguration: AppConfiguration,
  ) {}

  async check(): Promise<HealthResponse> {
    const services = await Promise.all([this.checkDatabase(), this.checkAiService(), this.checkCallbacks()]);
    return { isHealthy: services.every((service) => service.state !== "down"), services };
  }

  private checkDatabase(): Promise<ServiceHealth> {
    return this.measure("database", async () => {
      await this.prismaService.$queryRaw`SELECT 1`;
    });
  }

  private checkAiService(): Promise<ServiceHealth> {
    if (!this.appConfiguration.isAiServiceConfigured) return Promise.resolve(this.notConfigured("ai"));
    return this.measure("ai", async () => {
      const response = await fetch(`${this.appConfiguration.aiServiceUrl}/health`, { signal: AbortSignal.timeout(this.aiServiceTimeoutMilliseconds) });
      if (!response.ok) throw new Error(`ai/ answered ${response.status}`);
    });
  }

  private async checkCallbacks(): Promise<ServiceHealth> {
    if (!this.appConfiguration.isTwilioConfigured) return this.notConfigured("callbacks");
    return { name: "callbacks", state: "up", latencyMilliseconds: null };
  }

  private async measure(name: string, probe: () => Promise<void>): Promise<ServiceHealth> {
    const startedAt = performance.now();
    try {
      await probe();
      return { name, state: "up", latencyMilliseconds: Math.round(performance.now() - startedAt) };
    } catch {
      return { name, state: "down", latencyMilliseconds: null };
    }
  }

  private notConfigured(name: string): ServiceHealth {
    return { name, state: "notConfigured", latencyMilliseconds: null };
  }
}
