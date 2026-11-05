import { Injectable } from "@nestjs/common";
import type { VapiMessage } from "../types/VapiMessage";
import type { VapiToolCallEntry } from "../types/VapiToolCallEntry";
import type { VapiTranscriptEntry } from "../types/VapiTranscriptEntry";

@Injectable()
export class HandOffToolReader {
  private readonly toolName = "handOffToHuman";
  private readonly fallbackReason = "outOfScope";

  readReason(message: VapiMessage): string | null {
    const call = (message.artifact?.messages ?? []).flatMap((entry) => this.readToolCalls(entry)).find((toolCall) => toolCall.function?.name === this.toolName);
    if (!call) return null;
    return this.readArgumentReason(call.function?.arguments) ?? this.fallbackReason;
  }

  private readToolCalls(entry: VapiTranscriptEntry): VapiToolCallEntry[] {
    const toolCalls = (entry as { toolCalls?: unknown }).toolCalls;
    return Array.isArray(toolCalls) ? toolCalls : [];
  }

  private readArgumentReason(argumentsValue: unknown): string | null {
    try {
      const values = typeof argumentsValue === "string" ? JSON.parse(argumentsValue) : argumentsValue;
      const reason = (values as { reason?: unknown } | null)?.reason;
      return typeof reason === "string" && reason ? reason : null;
    } catch {
      return null;
    }
  }
}
