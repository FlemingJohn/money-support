import type { Speaker } from "../../generated/prisma/client";

export interface TranscriptLine {
  position: number;
  speaker: Speaker;
  text: string;
  secondsFromStart: number;
}
