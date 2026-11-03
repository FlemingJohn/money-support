import { NotFoundException } from "@nestjs/common";

export class CallbackNotFoundException extends NotFoundException {
  constructor(callbackId: string) {
    super(`No call back has the id ${callbackId}`);
  }
}
