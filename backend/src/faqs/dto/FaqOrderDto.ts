import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class FaqOrderDto extends createZodDto(
  z.object({
    faqIds: z.array(z.uuid()).min(1),
  }),
) {}
