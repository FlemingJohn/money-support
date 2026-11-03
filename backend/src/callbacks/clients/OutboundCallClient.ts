import type { CallbackStatus } from "../../generated/prisma/client";
import type { BridgeRequest } from "../types/BridgeRequest";

export abstract class OutboundCallClient {
  abstract startBridge(request: BridgeRequest): Promise<string>;

  abstract readStatus(providerCallId: string): Promise<CallbackStatus>;

  abstract endBridge(providerCallId: string): Promise<void>;
}
