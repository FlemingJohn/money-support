import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Clock } from "../common/services/Clock";
import { CallbackStatus } from "../generated/prisma/client";
import type { BridgeRequest } from "./BridgeRequest";
import type { BridgeSimulation } from "./BridgeSimulation";
import { OutboundCallClient } from "./OutboundCallClient";

@Injectable()
export class SimulatedBridgeClient extends OutboundCallClient {
  private readonly reviewerRingMilliseconds = 2000;
  private readonly callerRingMilliseconds = 4000;
  private readonly simulations = new Map<string, BridgeSimulation>();

  constructor(private readonly clock: Clock) {
    super();
  }

  async startBridge(request: BridgeRequest): Promise<string> {
    const providerCallId = `simulated-${randomUUID()}`;
    this.simulations.set(providerCallId, { startedAt: this.clock.now(), hasEnded: request.customerNumber.length === 0 });
    return providerCallId;
  }

  async readStatus(providerCallId: string): Promise<CallbackStatus> {
    const simulation = this.simulations.get(providerCallId);
    if (!simulation || simulation.hasEnded) return CallbackStatus.ended;
    const elapsed = this.clock.now().getTime() - simulation.startedAt.getTime();
    if (elapsed < this.reviewerRingMilliseconds) return CallbackStatus.ringingReviewer;
    if (elapsed < this.callerRingMilliseconds) return CallbackStatus.ringingCaller;
    return CallbackStatus.connected;
  }

  async endBridge(providerCallId: string): Promise<void> {
    const simulation = this.simulations.get(providerCallId);
    if (simulation) simulation.hasEnded = true;
  }
}
