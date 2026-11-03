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
        .default("That's not something I can help with on this line, so I'm transferring you to a human agent."),
      transferNumber: z.union([z.string().regex(/^\+\d{8,15}$/), z.literal("")]).default(""),
      teamHours: z.enum(["weekdays", "always"]).default("weekdays"),
    })
    .refine((settings) => settings.mode === "endCall" || settings.transferNumber.length > 0, {
      message: "A transfer number is required when the mode is transfer",
      path: ["transferNumber"],
    }),
) {}
