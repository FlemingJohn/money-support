import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import type { TestRunResult } from "../types/TestRunResult";

@Injectable()
export class AiTestRunClient {
  private static readonly responseSchema = z.object({
    results: z.array(z.object({ caseId: z.string(), name: z.string(), status: z.enum(["passed", "failed", "error"]), detail: z.string() })),
  });

  constructor(private readonly appConfiguration: AppConfiguration) {}

  async runAll(): Promise<TestRunResult[]> {
    const response = await fetch(`${this.appConfiguration.aiServiceUrl}/evaluations/run`, {
      method: "POST",
      headers: { "x-service-secret": this.appConfiguration.serviceSecret },
      signal: AbortSignal.timeout(290_000),
    });
    if (!response.ok) throw new Error(`ai/ answered ${response.status} when running the tests`);
    return AiTestRunClient.responseSchema.parse(await response.json()).results;
  }
}
