export interface TranscriptPart {
  text: string;
  kind: "plain" | "field" | "removed";
  fieldNumber?: number;
}
