import type { Prisma } from "../../generated/prisma/client";

export const callDetailInclude = {
  messages: { orderBy: { position: "asc" } },
  extractedFields: { orderBy: { number: "asc" } },
  guardrailEvents: { orderBy: { createdAt: "asc" } },
  matchedFaq: true,
  review: true,
} as const satisfies Prisma.CallInclude;
