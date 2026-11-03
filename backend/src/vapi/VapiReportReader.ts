import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { Clock } from "../common/services/Clock";
import { CallChannel, Speaker } from "../generated/prisma/client";
import type { TranscriptLine } from "../guardrails/TranscriptLine";
import type { FinishedCallReport } from "./FinishedCallReport";
import { VapiCallMissingException } from "./VapiCallMissingException";
import type { VapiMessage } from "./VapiMessage";
import type { VapiTranscriptEntry } from "./VapiTranscriptEntry";

@Injectable()
export class VapiReportReader {
  private static readonly structuredDataSchema = z.object({
    topic: z.string().optional(),
    matchedFaqNumber: z.number().int().positive().nullable().optional(),
    isHandedOff: z.boolean().optional(),
    fields: z.array(z.object({ label: z.string(), value: z.string(), confidence: z.number().min(0).max(1) })).optional(),
  });

  private readonly handOffEndedReason = "assistant-said-end-call-phrase";
  private readonly speakersByRole: Record<string, Speaker> = { user: Speaker.caller, bot: Speaker.agent, assistant: Speaker.agent };

  constructor(private readonly clock: Clock) {}

  read(message: VapiMessage): FinishedCallReport {
    const structuredData = this.readStructuredData(message);
    return {
      callId: this.readCallId(message),
      channel: this.readChannel(message),
      customerNumber: message.call?.customer?.number ?? null,
      startedAt: this.readDate(message.startedAt),
      endedAt: this.readDate(message.endedAt) ?? this.clock.now(),
      endedReason: message.endedReason ?? null,
      summary: message.analysis?.summary ?? null,
      topic: structuredData.topic ?? null,
      matchedFaqNumber: structuredData.matchedFaqNumber ?? null,
      isHandedOff: structuredData.isHandedOff ?? message.endedReason === this.handOffEndedReason,
      lines: this.readLines(message),
      fields: structuredData.fields ?? [],
    };
  }

  readCallId(message: VapiMessage): string {
    if (!message.call) throw new VapiCallMissingException();
    return message.call.id;
  }

  readChannel(message: VapiMessage): CallChannel {
    return message.call?.type === "webCall" ? CallChannel.web : CallChannel.phone;
  }

  private readStructuredData(message: VapiMessage) {
    const result = VapiReportReader.structuredDataSchema.safeParse(message.analysis?.structuredData ?? {});
    return result.success ? result.data : VapiReportReader.structuredDataSchema.parse({});
  }

  private readDate(value: string | undefined): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private readLines(message: VapiMessage): TranscriptLine[] {
    return (message.artifact?.messages ?? [])
      .filter((entry) => this.isSpokenLine(entry))
      .map((entry, position) => ({
        position,
        speaker: this.speakersByRole[entry.role],
        text: entry.message ?? "",
        secondsFromStart: entry.secondsFromStart ?? 0,
      }));
  }

  private isSpokenLine(entry: VapiTranscriptEntry): boolean {
    return entry.role in this.speakersByRole && Boolean(entry.message?.trim());
  }
}
