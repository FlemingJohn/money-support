import { NotFoundException } from "@nestjs/common";

export class FaqNotFoundException extends NotFoundException {
  constructor(faqId: string) {
    super(`No FAQ has the id ${faqId}`);
  }
}
