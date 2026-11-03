import { BadRequestException } from "@nestjs/common";

export class VapiCallMissingException extends BadRequestException {
  constructor() {
    super("The Vapi message has no call");
  }
}
