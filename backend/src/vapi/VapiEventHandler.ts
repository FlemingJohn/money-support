import type { VapiMessage } from "./VapiMessage";

export abstract class VapiEventHandler {
  abstract readonly eventType: string;

  abstract handle(message: VapiMessage): Promise<void>;
}
