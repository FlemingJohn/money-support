import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class StartCallbackDto extends createZodDto(
  z.object({
    ringPhone: z.enum(["desk", "mobile"]),
  }),
) {}
