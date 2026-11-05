import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import type { StreamEvent } from "../types/StreamEvent";

@Injectable()
export class EventStreamWriter {
  start(response: Response): void {
    response.status(200);
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("X-Accel-Buffering", "no");
    response.flushHeaders();
  }

  send(response: Response, event: StreamEvent): void {
    response.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  end(response: Response): void {
    response.end();
  }
}
