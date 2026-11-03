import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class CreateFaqDto extends createZodDto(
  z.object({
    question: z.string().trim().min(1).max(300),
    answer: z.string().trim().min(1).max(1200),
    category: z.string().trim().min(1).max(40),
    isActive: z.boolean().default(true),
  }),
) {}
