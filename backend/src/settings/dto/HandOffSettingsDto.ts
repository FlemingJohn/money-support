import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class HandOffSettingsDto extends createZodDto(
  z
    .object({
      mode: z.enum(["endCall", "transfer"]).default("endCall"),
      handOffSentence: z
        .string()
        .trim()
        .min(1)
        .max(300)
        .default("Please contact the Wise support team through the Help section of the Wise app or website."),
      transferNumber: z.union([z.string().regex(/^\+\d{8,15}$/), z.literal("")]).default(""),
      teamHours: z.enum(["weekdays", "always"]).default("weekdays"),
      emailTeam: z.boolean().default(true),
      teamEmail: z.union([z.email(), z.literal("")]).default(""),
    })
    .refine((settings) => settings.mode === "endCall" || settings.transferNumber.length > 0, {
      message: "A transfer number is required when the mode is transfer",
      path: ["transferNumber"],
    }),
) {}
