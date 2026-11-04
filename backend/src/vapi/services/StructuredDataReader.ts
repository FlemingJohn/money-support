import { Injectable, Logger } from "@nestjs/common";
import type { ReportedField } from "../types/ReportedField";
import type { StructuredCallData } from "../types/StructuredCallData";

@Injectable()
export class StructuredDataReader {
  private readonly logger = new Logger(StructuredDataReader.name);

  read(structuredData: unknown): StructuredCallData {
    const values = this.isRecord(structuredData) ? structuredData : {};
    const droppedNames: string[] = [];
    const result = {
      topic: this.readTopic(values.topic, droppedNames),
      matchedFaqNumber: this.readFaqNumber(values.matchedFaqNumber, droppedNames),
      isHandedOff: this.readHandOff(values.isHandedOff, droppedNames),
      fields: this.readFields(values.fields, droppedNames),
    };
    if (droppedNames.length > 0) this.logger.warn(`Dropped structured data values: ${droppedNames.join(", ")}`);
    return result;
  }

  private readTopic(topic: unknown, droppedNames: string[]): string | null {
    if (topic === undefined || topic === null) return null;
    if (typeof topic === "string" && topic.trim().length > 0) return topic.trim().slice(0, 200);
    droppedNames.push("topic");
    return null;
  }

  private readFaqNumber(faqNumber: unknown, droppedNames: string[]): number | null {
    if (faqNumber === undefined || faqNumber === null || faqNumber === 0) return null;
    if (typeof faqNumber === "number" && Number.isInteger(faqNumber) && faqNumber > 0) return faqNumber;
    droppedNames.push("matchedFaqNumber");
    return null;
  }

  private readHandOff(isHandedOff: unknown, droppedNames: string[]): boolean | null {
    if (isHandedOff === undefined || isHandedOff === null) return null;
    if (typeof isHandedOff === "boolean") return isHandedOff;
    droppedNames.push("isHandedOff");
    return null;
  }

  private readFields(fields: unknown, droppedNames: string[]): ReportedField[] {
    if (fields === undefined || fields === null) return [];
    if (!Array.isArray(fields)) {
      droppedNames.push("fields");
      return [];
    }
    return fields.flatMap((field, index) => {
      const reportedField = this.readField(field);
      if (!reportedField) droppedNames.push(`fields[${index}]`);
      return reportedField ? [reportedField] : [];
    });
  }

  private readField(field: unknown): ReportedField | null {
    if (!this.isRecord(field)) return null;
    const { label, value, confidence } = field;
    if (typeof label !== "string" || !label.trim() || typeof value !== "string" || !value.trim()) return null;
    if (typeof confidence !== "number" || confidence < 0 || confidence > 100) return null;
    return { label: label.trim(), value: value.trim(), confidence: confidence > 1 ? confidence / 100 : confidence };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
}
