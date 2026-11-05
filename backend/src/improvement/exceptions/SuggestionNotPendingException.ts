import { ConflictException } from "@nestjs/common";

export class SuggestionNotPendingException extends ConflictException {
  constructor(id: string) {
    super(`Suggestion ${id} is not waiting for a decision`);
  }
}
