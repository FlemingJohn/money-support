import { z } from "zod";

export const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  DATABASE_CA_CERTIFICATE: z.string().default(""),
  VAPI_WEBHOOK_SECRET: z.string().min(16),
  VAPI_API_KEY: z.string().default(""),
  SERVICE_SECRET: z.string().min(16),
  CRON_SECRET: z.string().min(16),
  AI_SERVICE_URL: z.union([z.url(), z.literal("")]).default(""),
  TWILIO_ACCOUNT_SID: z.string().default(""),
  TWILIO_AUTH_TOKEN: z.string().default(""),
  TWILIO_CALLER_NUMBER: z.string().default(""),
  MAIL_USER: z.union([z.email(), z.literal("")]).default(""),
  MAIL_APP_PASSWORD: z.string().default(""),
});
