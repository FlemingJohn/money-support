import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class PrivacySettingsDto extends createZodDto(
  z.object({
    maskCardNumbers: z.boolean().default(true),
    maskBankAccountNumbers: z.boolean().default(true),
    maskEmailAddresses: z.boolean().default(true),
    maskNames: z.boolean().default(true),
    keepNumbersForCallbacks: z.boolean().default(true),
    deleteVapiCopy: z.boolean().default(true),
    startInPrivacyMode: z.boolean().default(false),
    transcriptRetentionDays: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(30),
  }),
) {}
