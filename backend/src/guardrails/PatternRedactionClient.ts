import { Injectable } from "@nestjs/common";
import type { PersonalDataPattern } from "./PersonalDataPattern";
import type { RedactedLine } from "./RedactedLine";
import { RedactionClient } from "./RedactionClient";
import type { TranscriptLine } from "./TranscriptLine";

@Injectable()
export class PatternRedactionClient extends RedactionClient {
  private readonly patterns: PersonalDataPattern[] = [
    { entityType: "bank account number", expression: /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){3,7}(?: ?[A-Z0-9]{1,3})?\b/g },
    { entityType: "card number", expression: /\b(?:\d[ -]?){12,18}\d\b/g },
    { entityType: "email address", expression: /[\w.+-]+@[\w-]+\.[\w.-]+/g },
    { entityType: "phone number", expression: /\+?\d[\d ()-]{7,}\d/g },
  ];

  async redactLines(lines: TranscriptLine[]): Promise<RedactedLine[]> {
    return lines.map((line) => this.redactLine(line));
  }

  private redactLine(line: TranscriptLine): RedactedLine {
    const removedEntityTypes: string[] = [];
    const redactedText = this.patterns.reduce(
      (text, pattern) => text.replace(pattern.expression, () => this.replacement(pattern, removedEntityTypes)),
      line.text,
    );
    return {
      position: line.position,
      speaker: line.speaker,
      redactedText,
      secondsFromStart: line.secondsFromStart,
      removedEntityTypes,
    };
  }

  private replacement(pattern: PersonalDataPattern, removedEntityTypes: string[]): string {
    removedEntityTypes.push(pattern.entityType);
    return `[${pattern.entityType} removed]`;
  }
}
