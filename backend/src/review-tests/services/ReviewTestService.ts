import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { AiEventStream } from "../../common/services/AiEventStream";
import { Clock } from "../../common/services/Clock";
import { EventStreamWriter } from "../../common/services/EventStreamWriter";
import { AiTestRunClient } from "../clients/AiTestRunClient";
import { ReviewTestPresenter } from "../presenters/ReviewTestPresenter";
import { TestRunPresenter } from "../presenters/TestRunPresenter";
import { ReviewTestRepository } from "../repositories/ReviewTestRepository";
import { TestRunRepository } from "../repositories/TestRunRepository";
import type { LastTestRunResponse } from "../responses/LastTestRunResponse";
import type { ReviewTestListResponse } from "../responses/ReviewTestListResponse";
import type { ReviewTestResponse } from "../responses/ReviewTestResponse";
import type { TestRunResponse } from "../responses/TestRunResponse";
import type { ReviewTestCase } from "../types/ReviewTestCase";
import type { TestRunResult } from "../types/TestRunResult";
import { ReviewTestCaseBuilder } from "./ReviewTestCaseBuilder";
import { TestRunRecorder } from "./TestRunRecorder";

@Injectable()
export class ReviewTestService {
  constructor(
    private readonly reviewTestRepository: ReviewTestRepository,
    private readonly testRunRepository: TestRunRepository,
    private readonly reviewTestPresenter: ReviewTestPresenter,
    private readonly testRunPresenter: TestRunPresenter,
    private readonly reviewTestCaseBuilder: ReviewTestCaseBuilder,
    private readonly testRunRecorder: TestRunRecorder,
    private readonly aiTestRunClient: AiTestRunClient,
    private readonly aiEventStream: AiEventStream,
    private readonly eventStreamWriter: EventStreamWriter,
    private readonly clock: Clock,
  ) {}

  async list(): Promise<ReviewTestListResponse> {
    const tests = await this.reviewTestRepository.findAll();
    return { tests: tests.map((test) => this.reviewTestPresenter.toResponse(test)) };
  }

  async getLastRun(): Promise<LastTestRunResponse> {
    const run = await this.testRunRepository.findLatest();
    return { run: run ? this.testRunPresenter.toResponse(run) : null };
  }

  async setEnabled(id: string, isEnabled: boolean): Promise<ReviewTestResponse> {
    return this.reviewTestPresenter.toResponse(await this.reviewTestRepository.setEnabled(id, isEnabled));
  }

  async listEnabledCases(): Promise<ReviewTestCase[]> {
    const tests = await this.reviewTestRepository.findEnabled();
    return tests.map((test) => this.reviewTestCaseBuilder.build(test));
  }

  async runAll(): Promise<TestRunResponse> {
    const startedAt = this.clock.now();
    return this.testRunRecorder.record(startedAt, this.clock.now(), await this.aiTestRunClient.runAll());
  }

  async streamRun(response: Response): Promise<void> {
    const startedAt = this.clock.now();
    this.eventStreamWriter.start(response);
    try {
      for await (const event of this.aiEventStream.open("/evaluations/run/stream")) {
        if (event.type !== "finished") {
          this.eventStreamWriter.send(response, event);
          continue;
        }
        const results = (event.report as { results: TestRunResult[] }).results;
        this.eventStreamWriter.send(response, { type: "finished", run: await this.testRunRecorder.record(startedAt, this.clock.now(), results) });
      }
    } catch (error) {
      this.eventStreamWriter.send(response, { type: "error", message: `The tests could not run: ${String(error)}` });
    }
    this.eventStreamWriter.end(response);
  }
}
