import type { Speaker } from "@/types/Speaker";

export interface CallMessage {
  id: string;
  position: number;
  speaker: Speaker;
  text: string;
  secondsFromStart: number;
}
