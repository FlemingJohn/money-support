import { getFromBackend } from "@/lib/getFromBackend";
import type { Callback } from "@/types/Callback";

export function getCallbacks(callId: string): Promise<Callback[]> {
  return getFromBackend<Callback[]>(`/reviews/${encodeURIComponent(callId)}/callbacks`);
}
