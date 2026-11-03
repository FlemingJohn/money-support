import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class ActivityQueryDto extends createZodDto(
  z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
) {}
