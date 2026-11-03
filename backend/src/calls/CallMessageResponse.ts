import type { Speaker } from "../generated/prisma/client";

export interface CallMessageResponse {
  id: string;
  position: number;
  speaker: Speaker;
  text: string;
  secondsFromStart: number;
}
