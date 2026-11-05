import { Injectable } from "@nestjs/common";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import type { StreamEvent } from "../types/StreamEvent";
import { ServerSentEventParser } from "./ServerSentEventParser";

@Injectable()
export class AiEventStream {
  constructor(private readonly appConfiguration: AppConfiguration) {}

  async *open(path: string): AsyncGenerator<StreamEvent> {
    const response = await fetch(`${this.appConfiguration.aiServiceUrl}${path}`, {
      method: "POST",
      headers: { "x-service-secret": this.appConfiguration.serviceSecret },
      signal: AbortSignal.timeout(295_000),
    });
    if (!response.ok || !response.body) throw new Error(`ai/ answered ${response.status} for ${path}`);
    const parser = new ServerSentEventParser();
    const decoder = new TextDecoder();
    for await (const chunk of response.body) {
      yield* parser.feed(decoder.decode(chunk, { stream: true }));
    }
  }
}
