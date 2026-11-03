export interface LocatedField {
  number: number;
  label: string;
  value: string;
  confidence: number;
  messageId: string | null;
  startOffset: number | null;
  endOffset: number | null;
}
