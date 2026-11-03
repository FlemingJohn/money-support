import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ReviewStatus } from "../../generated/prisma/client";

export class ReviewFilterDto extends createZodDto(
  z.object({
    status: z.enum(ReviewStatus).default(ReviewStatus.open),
  }),
) {}
