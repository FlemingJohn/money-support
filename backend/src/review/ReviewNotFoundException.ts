import { NotFoundException } from "@nestjs/common";

export class ReviewNotFoundException extends NotFoundException {
  constructor(callId: string) {
    super(`No review exists for call ${callId}`);
  }
}
