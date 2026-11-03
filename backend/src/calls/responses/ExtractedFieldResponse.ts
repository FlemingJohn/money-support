export interface ExtractedFieldResponse {
  id: string;
  number: number;
  label: string;
  value: string;
  confidence: number;
  messageId: string | null;
  startOffset: number | null;
  endOffset: number | null;
  isConfirmed: boolean;
}
