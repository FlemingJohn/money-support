import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const phoneNumber = z.union([z.string().regex(/^\+\d{8,15}$/), z.literal("")]).default("");

export class PhoneSettingsDto extends createZodDto(
  z.object({
    deskPhone: phoneNumber,
    mobilePhone: phoneNumber,
    storedNumberRetention: z.enum(["whenResolved", "afterSevenDays"]).default("whenResolved"),
  }),
) {}
