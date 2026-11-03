import { z } from "zod";

export const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  VAPI_WEBHOOK_SECRET: z.string().min(16),
  VAPI_API_KEY: z.string().default(""),
  SERVICE_SECRET: z.string().min(16),
  AI_SERVICE_URL: z.union([z.url(), z.literal("")]).default(""),
  ENCRYPTION_KEY: z.string().refine((value) => Buffer.from(value, "base64").length === 32, {
    message: "ENCRYPTION_KEY must be 32 bytes encoded as base64",
  }),
  TWILIO_ACCOUNT_SID: z.string().default(""),
  TWILIO_AUTH_TOKEN: z.string().default(""),
  TWILIO_CALLER_NUMBER: z.string().default(""),
});
