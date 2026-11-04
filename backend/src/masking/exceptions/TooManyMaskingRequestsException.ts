import { HttpException, HttpStatus } from "@nestjs/common";

export class TooManyMaskingRequestsException extends HttpException {
  constructor() {
    super("Too many lines to check right now, please wait a moment", HttpStatus.TOO_MANY_REQUESTS);
  }
}
