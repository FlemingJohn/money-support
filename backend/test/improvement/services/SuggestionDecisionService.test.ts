import type { ActivityLog } from "../../../src/activity/services/ActivityLog";
import type { AssistantSyncService } from "../../../src/assistant/services/AssistantSyncService";
import type { Clock } from "../../../src/common/services/Clock";
import { PromptSuggestionStatus } from "../../../src/generated/prisma/client";
import { ImprovementPresenter } from "../../../src/improvement/presenters/ImprovementPresenter";
import type { PromptRuleRepository } from "../../../src/improvement/repositories/PromptRuleRepository";
import type { PromptSuggestionRepository } from "../../../src/improvement/repositories/PromptSuggestionRepository";
import { SuggestionDecisionService } from "../../../src/improvement/services/SuggestionDecisionService";
import type { PrismaService } from "../../../src/prisma/services/PrismaService";

describe("SuggestionDecisionService", () => {
  const now = new Date("2026-11-05T12:00:00Z");
  const pending = { id: "s1", ruleText: "Fees are never in scope.", explanation: "", status: PromptSuggestionStatus.pending, passedBefore: 25, passedAfter: 27, totalTests: 27, createdAt: now, decidedAt: null, reviews: [{ suggestionId: "s1", reviewCallId: "c1" }] };
  const suggestions = { findById: jest.fn(), decide: jest.fn() };
  const rules = { create: jest.fn(), setAddedInVersion: jest.fn() };
  const sync = { syncAgent: jest.fn() };
  const activity = { record: jest.fn() };
  const prisma = { $transaction: jest.fn((work: (transaction: object) => unknown) => work({})) };
  const service = new SuggestionDecisionService(
    prisma as unknown as PrismaService,
    suggestions as unknown as PromptSuggestionRepository,
    rules as unknown as PromptRuleRepository,
    sync as unknown as AssistantSyncService,
    new ImprovementPresenter(),
    activity as unknown as ActivityLog,
    { now: () => now } as Clock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    suggestions.findById.mockResolvedValue(pending);
    suggestions.decide.mockImplementation((_transaction: object, _id: string, status: PromptSuggestionStatus) => Promise.resolve({ ...pending, status, decidedAt: now }));
    rules.create.mockResolvedValue({ id: "r1" });
    sync.syncAgent.mockResolvedValue({ status: "synced", promptVersionId: "v14" });
  });

  it("adds the rule, updates the agent and links the rule to the new prompt version", async () => {
    const approved = await service.approve("s1");
    expect(rules.create).toHaveBeenCalledWith({}, "Fees are never in scope.", "s1");
    expect(sync.syncAgent).toHaveBeenCalledTimes(1);
    expect(rules.setAddedInVersion).toHaveBeenCalledWith("r1", "v14");
    expect(approved.status).toBe(PromptSuggestionStatus.approved);
  });

  it("rejects without touching the agent", async () => {
    const rejected = await service.reject("s1");
    expect(rejected.status).toBe(PromptSuggestionStatus.rejected);
    expect(sync.syncAgent).not.toHaveBeenCalled();
    expect(rules.create).not.toHaveBeenCalled();
  });

  it("refuses a suggestion that is not waiting for a decision", async () => {
    suggestions.findById.mockResolvedValue({ ...pending, status: PromptSuggestionStatus.discarded });
    await expect(service.approve("s1")).rejects.toThrow("not waiting for a decision");
  });
});
