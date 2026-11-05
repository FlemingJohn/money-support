import type { StreamEvent } from "../types/StreamEvent";

export class ServerSentEventParser {
  private pending = "";

  feed(text: string): StreamEvent[] {
    this.pending += text;
    const blocks = this.pending.split("\n\n");
    this.pending = blocks.pop() ?? "";
    return blocks.flatMap((block) => this.readBlock(block));
  }

  private readBlock(block: string): StreamEvent[] {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .map((line) => line.slice("data: ".length))
      .join("");
    return data ? [JSON.parse(data) as StreamEvent] : [];
  }
}
