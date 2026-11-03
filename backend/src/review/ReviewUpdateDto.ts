import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ReviewStatus } from "../generated/prisma/client";

export class ReviewUpdateDto extends createZodDto(
  z
    .object({
      status: z.enum(ReviewStatus).optional(),
      note: z.string().max(2000).optional(),
    })
    .refine((changes) => changes.status !== undefined || changes.note !== undefined, {
      message: "Send a status, a note or both",
    }),
) {}
