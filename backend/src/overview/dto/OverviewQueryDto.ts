import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class OverviewQueryDto extends createZodDto(
  z.object({
    period: z.enum(["today", "7d", "30d"]).default("7d"),
  }),
) {}
