import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class PromptRuleUpdateDto extends createZodDto(z.object({ isEnabled: z.boolean() })) {}
