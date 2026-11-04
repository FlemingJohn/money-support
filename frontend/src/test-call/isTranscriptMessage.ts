import type { VapiTranscriptMessage } from "@/types/VapiTranscriptMessage";

export function isTranscriptMessage(message: unknown): message is VapiTranscriptMessage {
  const candidate = message as Partial<VapiTranscriptMessage> | null;
  return candidate?.type === "transcript" && typeof candidate.transcript === "string";
}
