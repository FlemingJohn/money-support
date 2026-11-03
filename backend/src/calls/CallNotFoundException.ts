import { NotFoundException } from "@nestjs/common";

export class CallNotFoundException extends NotFoundException {
  constructor(callId: string) {
    super(`No call has the id ${callId}`);
  }
}
