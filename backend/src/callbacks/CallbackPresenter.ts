import { Injectable } from "@nestjs/common";
import type { Callback } from "../generated/prisma/client";
import type { CallbackResponse } from "./CallbackResponse";

@Injectable()
export class CallbackPresenter {
  toResponse(callback: Callback): CallbackResponse {
    return {
      id: callback.id,
      callId: callback.callId,
      ringPhone: callback.ringPhone,
      status: callback.status,
      startedAt: callback.startedAt.toISOString(),
      connectedAt: callback.connectedAt?.toISOString() ?? null,
      endedAt: callback.endedAt?.toISOString() ?? null,
      durationSeconds: callback.durationSeconds,
    };
  }
}
