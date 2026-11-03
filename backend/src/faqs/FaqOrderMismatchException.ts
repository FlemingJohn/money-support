import { BadRequestException } from "@nestjs/common";

export class FaqOrderMismatchException extends BadRequestException {
  constructor() {
    super("The new order must list every FAQ exactly once");
  }
}
