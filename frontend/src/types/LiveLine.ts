import type { Speaker } from "@/types/Speaker";

export interface LiveLine {
  id: number;
  speaker: Speaker;
  text: string;
  finalText: string;
  secondsFromStart: number;
  isFinal: boolean;
}
