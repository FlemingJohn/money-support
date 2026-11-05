import { Injectable } from "@nestjs/common";
import type { Prisma, TestRun } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";
import type { TestRunResult } from "../types/TestRunResult";

@Injectable()
export class TestRunRepository {
  constructor(private readonly prismaService: PrismaService) {}

  save(startedAt: Date, finishedAt: Date, results: TestRunResult[]): Promise<TestRun> {
    return this.prismaService.testRun.create({
      data: {
        startedAt,
        finishedAt,
        passedCount: results.filter((result) => result.status === "passed").length,
        totalCount: results.length,
        results: results as unknown as Prisma.InputJsonValue,
      },
    });
  }

  findLatest(): Promise<TestRun | null> {
    return this.prismaService.testRun.findFirst({ orderBy: { finishedAt: "desc" } });
  }
}
