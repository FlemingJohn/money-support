export interface ExtractedField {
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
