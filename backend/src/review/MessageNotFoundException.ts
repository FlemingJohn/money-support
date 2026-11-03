import { NotFoundException } from "@nestjs/common";

export class MessageNotFoundException extends NotFoundException {
  constructor(callId: string, messageId: string) {
    super(`Call ${callId} has no message ${messageId}`);
  }
}
