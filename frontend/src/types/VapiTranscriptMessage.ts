export interface VapiTranscriptMessage {
  type: "transcript";
  role: "assistant" | "user";
  transcriptType: "partial" | "final";
  transcript: string;
}
