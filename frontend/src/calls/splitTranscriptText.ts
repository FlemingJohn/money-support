import type { ExtractedField } from "@/types/ExtractedField";
import type { TranscriptPart } from "@/types/TranscriptPart";

const removedDataPattern = /\[[a-z ]+ removed\]/g;

export function splitTranscriptText(text: string, fields: ExtractedField[]): TranscriptPart[] {
  const parts: TranscriptPart[] = [];
  let position = 0;
  for (const field of findPlacedFields(text, fields)) {
    parts.push(...splitRemovedData(text.slice(position, field.startOffset)));
    parts.push({ text: text.slice(field.startOffset, field.endOffset), kind: "field", fieldNumber: field.number });
    position = field.endOffset;
  }
  parts.push(...splitRemovedData(text.slice(position)));
  return parts.filter((part) => part.text.length > 0);
}

function findPlacedFields(text: string, fields: ExtractedField[]) {
  const placed = fields
    .filter((field) => field.startOffset !== null && field.endOffset !== null)
    .map((field) => ({ number: field.number, startOffset: field.startOffset ?? 0, endOffset: Math.min(field.endOffset ?? 0, text.length) }))
    .filter((field) => field.startOffset < field.endOffset)
    .sort((first, second) => first.startOffset - second.startOffset);
  return placed.filter((field, index) => index === 0 || field.startOffset >= placed[index - 1].endOffset);
}

function splitRemovedData(text: string): TranscriptPart[] {
  const parts: TranscriptPart[] = [];
  let position = 0;
  for (const match of text.matchAll(removedDataPattern)) {
    parts.push({ text: text.slice(position, match.index), kind: "plain" });
    parts.push({ text: match[0].slice(1, -1), kind: "removed" });
    position = match.index + match[0].length;
  }
  parts.push({ text: text.slice(position), kind: "plain" });
  return parts;
}
