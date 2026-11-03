import { Injectable } from "@nestjs/common";
import type { LocatedField } from "../calls/types/LocatedField";
import type { CallMessage } from "../generated/prisma/client";
import type { FieldPosition } from "./FieldPosition";
import type { ReportedField } from "./ReportedField";

@Injectable()
export class FieldLocator {
  private readonly noPosition: FieldPosition = { messageId: null, startOffset: null, endOffset: null };

  locate(fields: ReportedField[], messages: CallMessage[]): LocatedField[] {
    return fields.map((field, index) => ({
      number: index + 1,
      label: field.label,
      value: field.value,
      confidence: field.confidence,
      ...this.findPosition(field.value, messages),
    }));
  }

  private findPosition(value: string, messages: CallMessage[]): FieldPosition {
    const searchText = value.trim().toLowerCase();
    if (searchText.length === 0) return this.noPosition;
    const match = messages.find((message) => message.redactedText.toLowerCase().includes(searchText));
    if (!match) return this.noPosition;
    const startOffset = match.redactedText.toLowerCase().indexOf(searchText);
    return { messageId: match.id, startOffset, endOffset: startOffset + searchText.length };
  }
}
