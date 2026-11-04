import type { CallMessage } from "@/types/CallMessage";
import type { ExtractedField } from "@/types/ExtractedField";

export interface TranscriptLineProps {
  callId: string;
  message: CallMessage;
  fields: ExtractedField[];
}
