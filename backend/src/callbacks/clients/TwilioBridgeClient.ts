import { Injectable } from "@nestjs/common";
import twilio, { type Twilio } from "twilio";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { CallbackStatus } from "../../generated/prisma/client";
import type { BridgeRequest } from "../types/BridgeRequest";
import { OutboundCallClient } from "./OutboundCallClient";

@Injectable()
export class TwilioBridgeClient extends OutboundCallClient {
  private readonly client: Twilio;
  private readonly statusesByTwilioStatus: Record<string, CallbackStatus> = {
    queued: CallbackStatus.ringingReviewer,
    initiated: CallbackStatus.ringingReviewer,
    ringing: CallbackStatus.ringingReviewer,
    "in-progress": CallbackStatus.connected,
    completed: CallbackStatus.ended,
    busy: CallbackStatus.failed,
    failed: CallbackStatus.failed,
    "no-answer": CallbackStatus.failed,
    canceled: CallbackStatus.failed,
  };

  constructor(private readonly appConfiguration: AppConfiguration) {
    super();
    this.client = twilio(appConfiguration.twilioAccountSid, appConfiguration.twilioAuthToken);
  }

  async startBridge(request: BridgeRequest): Promise<string> {
    const instructions = new twilio.twiml.VoiceResponse();
    instructions.dial({ callerId: this.appConfiguration.twilioCallerNumber }, request.customerNumber);
    const call = await this.client.calls.create({
      to: request.reviewerNumber,
      from: this.appConfiguration.twilioCallerNumber,
      twiml: instructions.toString(),
    });
    return call.sid;
  }

  async readStatus(providerCallId: string): Promise<CallbackStatus> {
    const call = await this.client.calls(providerCallId).fetch();
    return this.statusesByTwilioStatus[call.status] ?? CallbackStatus.failed;
  }

  async endBridge(providerCallId: string): Promise<void> {
    await this.client.calls(providerCallId).update({ status: "completed" });
  }
}
