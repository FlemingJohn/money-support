import type { LiveLine } from "@/types/LiveLine";
import type { VapiTranscriptMessage } from "@/types/VapiTranscriptMessage";

export function addTranscript(lines: LiveLine[], message: VapiTranscriptMessage, secondsFromStart: number): LiveLine[] {
  const speaker = message.role === "assistant" ? "agent" : "caller";
  const lastLine = lines.at(-1);
  const isFinal = message.transcriptType === "final";
  if (lastLine && !lastLine.isFinal && lastLine.speaker === speaker) {
    return [...lines.slice(0, -1), { ...lastLine, text: message.transcript, isFinal }];
  }
  return [...lines, { id: lines.length, speaker, text: message.transcript, secondsFromStart, isFinal }];
}
