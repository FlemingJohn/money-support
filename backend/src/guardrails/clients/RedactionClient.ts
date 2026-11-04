import type { RedactedLine } from "../types/RedactedLine";
import type { TranscriptLine } from "../types/TranscriptLine";

export abstract class RedactionClient {
  abstract redactLines(lines: TranscriptLine[], entityTypes: string[]): Promise<RedactedLine[]>;
}
