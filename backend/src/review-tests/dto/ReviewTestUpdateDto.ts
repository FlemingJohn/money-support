import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class ReviewTestUpdateDto extends createZodDto(z.object({ isEnabled: z.boolean() })) {}
