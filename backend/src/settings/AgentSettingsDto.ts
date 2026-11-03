import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class AgentSettingsDto extends createZodDto(
  z.object({
    assistantName: z.string().trim().min(1).max(80).default("Money Support Agent"),
    language: z.enum(["en"]).default("en"),
    greeting: z
      .string()
      .trim()
      .min(1)
      .max(400)
      .default("Hi, thanks for calling. I can help with questions about where your money is, like tracking a transfer or why it hasn't arrived yet. How can I help?"),
    voice: z.enum(["Elliot", "Kylie", "Rohan"]).default("Elliot"),
    longestCallMinutes: z.number().int().min(1).max(30).default(10),
    silenceSeconds: z.number().int().min(5).max(60).default(10),
  }),
) {}
