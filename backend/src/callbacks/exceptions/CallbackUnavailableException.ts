import { ConflictException } from "@nestjs/common";

export class CallbackUnavailableException extends ConflictException {
  constructor(reason: string) {
    super(reason);
  }
}
