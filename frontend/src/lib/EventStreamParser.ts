import type { StreamEvent } from "@/types/StreamEvent";

export class EventStreamParser {
  private pending = "";

  feed(text: string): StreamEvent[] {
    this.pending += text;
    const blocks = this.pending.split("\n\n");
    this.pending = blocks.pop() ?? "";
    return blocks.flatMap((block) => {
      const data = block
        .split("\n")
        .filter((line) => line.startsWith("data: "))
        .map((line) => line.slice("data: ".length))
        .join("");
      return data ? [JSON.parse(data) as StreamEvent] : [];
    });
  }
}
