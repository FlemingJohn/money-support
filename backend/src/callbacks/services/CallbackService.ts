import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallRepository } from "../../calls/repositories/CallRepository";
import { Clock } from "../../common/services/Clock";
import { ActivityAction, ActivityItemType, type Callback, CallbackStatus, type Prisma, ReviewStatus } from "../../generated/prisma/client";
import { ReviewNotFoundException } from "../../review/exceptions/ReviewNotFoundException";
import { ReviewRepository } from "../../review/repositories/ReviewRepository";
import { SettingsService } from "../../settings/services/SettingsService";
import { CallbackNotFoundException } from "../exceptions/CallbackNotFoundException";
import { CallbackPresenter } from "../presenters/CallbackPresenter";
import { CallbackRepository } from "../repositories/CallbackRepository";
import type { CallbackResponse } from "../responses/CallbackResponse";
import { CallbackUnavailableException } from "../exceptions/CallbackUnavailableException";
import { OutboundCallClient } from "../clients/OutboundCallClient";
import type { StartCallbackDto } from "../dto/StartCallbackDto";

@Injectable()
export class CallbackService {
  private readonly finishedStatuses: CallbackStatus[] = [CallbackStatus.ended, CallbackStatus.failed];

  constructor(
    private readonly callbackRepository: CallbackRepository,
    private readonly callbackPresenter: CallbackPresenter,
    private readonly outboundCallClient: OutboundCallClient,
    private readonly reviewRepository: ReviewRepository,
    private readonly callRepository: CallRepository,
    private readonly settingsService: SettingsService,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
  ) {}

  async start(callId: string, request: StartCallbackDto): Promise<CallbackResponse> {
    await this.requireOpenReview(callId);
    const customerNumber = await this.readCustomerNumber(callId);
    await this.ensureNoActiveCallback(callId);
    const reviewerNumber = await this.readReviewerNumber(request.ringPhone);
    const providerCallId = await this.outboundCallClient.startBridge({ reviewerNumber, customerNumber });
    const callback = await this.callbackRepository.create({ callId, ringPhone: request.ringPhone, providerCallId });
    await this.recordActivity(ActivityAction.callbackStarted, callback.id);
    return this.callbackPresenter.toResponse(callback);
  }

  async refresh(callbackId: string): Promise<CallbackResponse> {
    const callback = await this.requireCallback(callbackId);
    if (this.isFinished(callback) || !callback.providerCallId) return this.callbackPresenter.toResponse(callback);
    const status = await this.outboundCallClient.readStatus(callback.providerCallId);
    return this.saveStatus(callback, status);
  }

  async end(callbackId: string): Promise<CallbackResponse> {
    const callback = await this.requireCallback(callbackId);
    if (this.isFinished(callback)) return this.callbackPresenter.toResponse(callback);
    if (callback.providerCallId) await this.outboundCallClient.endBridge(callback.providerCallId);
    const response = await this.saveStatus(callback, CallbackStatus.ended);
    await this.recordActivity(ActivityAction.callbackEnded, callbackId);
    return response;
  }

  async listForCall(callId: string): Promise<CallbackResponse[]> {
    const callbacks = await this.callbackRepository.findForCall(callId);
    return callbacks.map((callback) => this.callbackPresenter.toResponse(callback));
  }

  private async requireOpenReview(callId: string): Promise<void> {
    const review = await this.reviewRepository.findByCallId(callId);
    if (!review) throw new ReviewNotFoundException(callId);
    if (review.status === ReviewStatus.done) throw new CallbackUnavailableException("This review is already resolved");
  }

  private async readCustomerNumber(callId: string): Promise<string> {
    const call = await this.callRepository.findById(callId);
    if (!call?.customerNumber) throw new CallbackUnavailableException("This call has no stored number to call back");
    return call.customerNumber;
  }

  private async ensureNoActiveCallback(callId: string): Promise<void> {
    const activeCallback = await this.callbackRepository.findActiveForCall(callId);
    if (activeCallback) throw new CallbackUnavailableException("A call back is already in progress for this call");
  }

  private async readReviewerNumber(ringPhone: StartCallbackDto["ringPhone"]): Promise<string> {
    const phone = await this.settingsService.getPhone();
    const reviewerNumber = ringPhone === "desk" ? phone.deskPhone : phone.mobilePhone;
    if (!reviewerNumber) throw new CallbackUnavailableException(`Add your ${ringPhone} phone number in Settings first`);
    return reviewerNumber;
  }

  private async requireCallback(callbackId: string): Promise<Callback> {
    const callback = await this.callbackRepository.findById(callbackId);
    if (!callback) throw new CallbackNotFoundException(callbackId);
    return callback;
  }

  private async saveStatus(callback: Callback, status: CallbackStatus): Promise<CallbackResponse> {
    const updated = await this.callbackRepository.update(callback.id, this.statusChanges(callback, status));
    return this.callbackPresenter.toResponse(updated);
  }

  private statusChanges(callback: Callback, status: CallbackStatus): Prisma.CallbackUpdateInput {
    const now = this.clock.now();
    const connectedAt = status === CallbackStatus.connected && !callback.connectedAt ? now : callback.connectedAt;
    if (!this.finishedStatuses.includes(status)) return { status, connectedAt };
    const durationSeconds = connectedAt ? Math.round((now.getTime() - connectedAt.getTime()) / 1000) : 0;
    return { status, connectedAt, endedAt: now, durationSeconds };
  }

  private isFinished(callback: Callback): boolean {
    return this.finishedStatuses.includes(callback.status);
  }

  private recordActivity(action: ActivityAction, callbackId: string): Promise<void> {
    return this.activityLog.record({ action, itemType: ActivityItemType.callback, itemId: callbackId });
  }
}
