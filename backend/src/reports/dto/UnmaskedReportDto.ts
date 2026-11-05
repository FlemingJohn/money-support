import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { maskKindLabels } from "../catalogs/maskKindLabels";

export class UnmaskedReportDto extends createZodDto(
  z.object({
    messageId: z.uuid(),
    selectedText: z.string().trim().min(1).max(200).optional(),
    kind: z.enum(maskKindLabels).optional(),
  }),
) {}
