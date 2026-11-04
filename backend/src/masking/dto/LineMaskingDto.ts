import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class LineMaskingDto extends createZodDto(
  z.object({
    text: z.string().max(2000),
  }),
) {}
