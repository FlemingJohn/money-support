import type { RedactedLine } from "./RedactedLine";
import type { TranscriptLine } from "./TranscriptLine";

export abstract class RedactionClient {
  abstract redactLines(lines: TranscriptLine[]): Promise<RedactedLine[]>;
}
