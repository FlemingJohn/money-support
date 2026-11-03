import type { Speaker } from "../../generated/prisma/client";

export interface RedactedLine {
  position: number;
  speaker: Speaker;
  redactedText: string;
  secondsFromStart: number;
  removedEntityTypes: string[];
}
