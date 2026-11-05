import { EventStreamParser } from "@/lib/EventStreamParser";
import type { StreamEvent } from "@/types/StreamEvent";

export async function streamFromBackend(path: string, onEvent: (event: StreamEvent) => void): Promise<void> {
  const response = await fetch(`/api${path}`, { method: "POST" });
  if (!response.ok || !response.body) throw new Error(`The backend answered ${response.status}`);
  const parser = new EventStreamParser();
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    parser.feed(chunk.value).forEach(onEvent);
  }
}
