import type { LiveLine } from "@/types/LiveLine";
import type { VapiTranscriptMessage } from "@/types/VapiTranscriptMessage";

export function addTranscript(lines: LiveLine[], message: VapiTranscriptMessage, secondsFromStart: number): LiveLine[] {
  const speaker = message.role === "assistant" ? "agent" : "caller";
  const isFinal = message.transcriptType === "final";
  const lastLine = lines.at(-1);
  if (lastLine?.speaker === speaker) {
    return [...lines.slice(0, -1), continueLine(lastLine, message.transcript, isFinal)];
  }
  const finalText = isFinal ? message.transcript : "";
  return [...lines, { id: lines.length, speaker, text: message.transcript, finalText, secondsFromStart, isFinal }];
}

function continueLine(line: LiveLine, transcript: string, isFinal: boolean): LiveLine {
  const text = joinText(line.finalText, transcript);
  return { ...line, text, finalText: isFinal ? text : line.finalText, isFinal };
}

function joinText(start: string, end: string): string {
  return [start, end].filter((part) => part.trim() !== "").join(" ");
}
