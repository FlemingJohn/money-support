import { Injectable } from "@nestjs/common";
import { Clock } from "../../common/services/Clock";
import { CallChannel, Speaker } from "../../generated/prisma/client";
import type { TranscriptLine } from "../../guardrails/types/TranscriptLine";
import type { FinishedCallReport } from "../types/FinishedCallReport";
import { VapiCallMissingException } from "../exceptions/VapiCallMissingException";
import { HandOffToolReader } from "./HandOffToolReader";
import type { VapiMessage } from "../types/VapiMessage";
import type { VapiTranscriptEntry } from "../types/VapiTranscriptEntry";

@Injectable()
export class VapiReportReader {
  private readonly speakersByRole: Record<string, Speaker> = { user: Speaker.caller, bot: Speaker.agent, assistant: Speaker.agent };

  constructor(
    private readonly clock: Clock,
    private readonly handOffToolReader: HandOffToolReader,
  ) {}

  read(message: VapiMessage): FinishedCallReport {
    return {
      callId: this.readCallId(message),
      channel: this.readChannel(message),
      customerNumber: message.call?.customer?.number ?? null,
      startedAt: this.readDate(message.startedAt),
      endedAt: this.readDate(message.endedAt) ?? this.clock.now(),
      endedReason: message.endedReason ?? null,
      lines: this.readLines(message),
      handOffReason: this.handOffToolReader.readReason(message),
    };
  }

  readCallId(message: VapiMessage): string {
    if (!message.call) throw new VapiCallMissingException();
    return message.call.id;
  }

  readChannel(message: VapiMessage): CallChannel {
    return message.call?.type === "webCall" ? CallChannel.web : CallChannel.phone;
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
