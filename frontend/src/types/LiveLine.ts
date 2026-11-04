import type { Speaker } from "@/types/Speaker";

export interface LiveLine {
  id: number;
  speaker: Speaker;
  text: string;
  secondsFromStart: number;
  isFinal: boolean;
}
