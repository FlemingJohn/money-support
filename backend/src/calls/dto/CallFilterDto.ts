import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CallOutcome } from "../../generated/prisma/client";

export class CallFilterDto extends createZodDto(
  z.object({
    outcome: z.enum(CallOutcome).optional(),
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
  }),
) {}
