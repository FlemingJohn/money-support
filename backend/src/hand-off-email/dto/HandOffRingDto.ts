import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class HandOffRingDto extends createZodDto(
  z.object({
    callId: z.string().min(1),
    reason: z.string().trim().min(1).max(120),
    callerNeed: z.string().trim().max(200).default(""),
  }),
) {}
