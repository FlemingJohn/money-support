import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/ActivityLog";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import type { CallDetailResponse } from "../responses/CallDetailResponse";
import type { CallFilterDto } from "../dto/CallFilterDto";
import { CallNotFoundException } from "../exceptions/CallNotFoundException";
import type { CallPageResponse } from "../responses/CallPageResponse";
import { CallPresenter } from "../presenters/CallPresenter";
import { CallRepository } from "../repositories/CallRepository";

@Injectable()
export class CallQueryService {
  constructor(
    private readonly callRepository: CallRepository,
    private readonly callPresenter: CallPresenter,
    private readonly activityLog: ActivityLog,
  ) {}

  async getPage(filter: CallFilterDto): Promise<CallPageResponse> {
    const { calls, total } = await this.callRepository.findPage(filter);
    return {
      calls: calls.map((call) => this.callPresenter.toSummary(call)),
      page: filter.page,
      pageSize: filter.pageSize,
      total,
    };
  }

  async getDetail(callId: string): Promise<CallDetailResponse> {
    const call = await this.callRepository.findDetail(callId);
    if (!call) throw new CallNotFoundException(callId);
    await this.activityLog.record({ action: ActivityAction.transcriptViewed, itemType: ActivityItemType.call, itemId: callId });
    return this.callPresenter.toDetail(call);
  }
}
