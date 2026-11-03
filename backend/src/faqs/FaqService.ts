import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../activity/ActivityLog";
import { AssistantSyncService } from "../assistant/AssistantSyncService";
import { ActivityAction, ActivityItemType, type Faq } from "../generated/prisma/client";
import type { CreateFaqDto } from "./CreateFaqDto";
import type { FaqListResponse } from "./FaqListResponse";
import type { FaqMutationResponse } from "./FaqMutationResponse";
import { FaqNotFoundException } from "./FaqNotFoundException";
import type { FaqOrderDto } from "./FaqOrderDto";
import { FaqOrderMismatchException } from "./FaqOrderMismatchException";
import { FaqPresenter } from "./FaqPresenter";
import { FaqRepository } from "./FaqRepository";
import type { FaqResponse } from "./FaqResponse";
import type { UpdateFaqDto } from "./UpdateFaqDto";

@Injectable()
export class FaqService {
  constructor(
    private readonly faqRepository: FaqRepository,
    private readonly faqPresenter: FaqPresenter,
    private readonly assistantSyncService: AssistantSyncService,
    private readonly activityLog: ActivityLog,
  ) {}

  async list(): Promise<FaqResponse[]> {
    const faqs = await this.faqRepository.findAll();
    return faqs.map((faq) => this.faqPresenter.toResponse(faq));
  }

  async listActive(): Promise<FaqResponse[]> {
    const faqs = await this.faqRepository.findActive();
    return faqs.map((faq) => this.faqPresenter.toResponse(faq));
  }

  async create(input: CreateFaqDto): Promise<FaqMutationResponse> {
    const faq = await this.faqRepository.create(input);
    return this.finishChange(faq, ActivityAction.faqCreated);
  }

  async update(faqId: string, changes: UpdateFaqDto): Promise<FaqMutationResponse> {
    await this.requireFaq(faqId);
    const faq = await this.faqRepository.update(faqId, changes);
    return this.finishChange(faq, ActivityAction.faqUpdated);
  }

  async remove(faqId: string): Promise<FaqListResponse> {
    await this.requireFaq(faqId);
    await this.faqRepository.delete(faqId);
    await this.activityLog.record({ action: ActivityAction.faqDeleted, itemType: ActivityItemType.faq, itemId: faqId });
    return this.listWithSync();
  }

  async reorder(order: FaqOrderDto): Promise<FaqListResponse> {
    const faqs = await this.faqRepository.findAll();
    if (!this.listsEveryFaqOnce(order.faqIds, faqs)) throw new FaqOrderMismatchException();
    await this.faqRepository.reorder(order.faqIds);
    await this.activityLog.record({ action: ActivityAction.faqsReordered, itemType: ActivityItemType.faq, itemId: "all" });
    return this.listWithSync();
  }

  private async requireFaq(faqId: string): Promise<Faq> {
    const faq = await this.faqRepository.findById(faqId);
    if (!faq) throw new FaqNotFoundException(faqId);
    return faq;
  }

  private async finishChange(faq: Faq, action: ActivityAction): Promise<FaqMutationResponse> {
    await this.activityLog.record({ action, itemType: ActivityItemType.faq, itemId: faq.id });
    const agentSync = await this.assistantSyncService.syncAgent();
    return { faq: this.faqPresenter.toResponse(faq), agentSync };
  }

  private async listWithSync(): Promise<FaqListResponse> {
    const agentSync = await this.assistantSyncService.syncAgent();
    return { faqs: await this.list(), agentSync };
  }

  private listsEveryFaqOnce(faqIds: string[], faqs: Faq[]): boolean {
    const uniqueIds = new Set(faqIds);
    return uniqueIds.size === faqIds.length && faqIds.length === faqs.length && faqs.every((faq) => uniqueIds.has(faq.id));
  }
}
