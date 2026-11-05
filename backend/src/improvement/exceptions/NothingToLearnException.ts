import { ConflictException } from "@nestjs/common";

export class NothingToLearnException extends ConflictException {
  constructor() {
    super("There are no failing tests from reviews to learn from yet. Mark a reply wrong on the Review page first.");
  }
}
