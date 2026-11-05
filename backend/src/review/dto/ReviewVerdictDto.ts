import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ReviewVerdict, VerdictReason } from "../../generated/prisma/client";

export class ReviewVerdictDto extends createZodDto(
  z
    .object({
      verdict: z.enum(ReviewVerdict),
      verdictReason: z.enum(VerdictReason).optional(),
      expectedBehaviour: z.string().trim().max(1000).optional(),
      verdictMessageId: z.uuid().optional(),
    })
    .refine((verdict) => (verdict.verdict === ReviewVerdict.wrong) === (verdict.verdictReason !== undefined), {
      message: "A reason is required when the agent was wrong, and not allowed when it was correct",
      path: ["verdictReason"],
    }),
) {}
