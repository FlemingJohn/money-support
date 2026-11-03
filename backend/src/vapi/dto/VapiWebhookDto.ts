import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class VapiWebhookDto extends createZodDto(
  z.object({
    message: z
      .object({
        type: z.string(),
        status: z.string().optional(),
        endedReason: z.string().optional(),
        startedAt: z.string().optional(),
        endedAt: z.string().optional(),
        call: z
          .object({
            id: z.string().min(1),
            type: z.string().optional(),
            customer: z.object({ number: z.string().optional() }).loose().optional(),
          })
          .loose()
          .optional(),
        artifact: z
          .object({
            messages: z
              .array(
                z
                  .object({
                    role: z.string(),
                    message: z.string().optional(),
                    secondsFromStart: z.number().optional(),
                  })
                  .loose(),
              )
              .optional(),
          })
          .loose()
          .optional(),
        analysis: z
          .object({
            summary: z.string().optional(),
            structuredData: z.unknown().optional(),
          })
          .loose()
          .optional(),
      })
      .loose(),
  }),
) {}
