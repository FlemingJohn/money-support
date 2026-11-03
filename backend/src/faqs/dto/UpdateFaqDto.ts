import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class UpdateFaqDto extends createZodDto(
  z
    .object({
      question: z.string().trim().min(1).max(300).optional(),
      answer: z.string().trim().min(1).max(1200).optional(),
      category: z.string().trim().min(1).max(40).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((changes) => Object.keys(changes).length > 0, { message: "Send at least one field to change" }),
) {}
