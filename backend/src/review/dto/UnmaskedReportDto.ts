import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class UnmaskedReportDto extends createZodDto(
  z.object({
    messageId: z.uuid(),
  }),
) {}
