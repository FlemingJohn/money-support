import type { Prisma } from "../../generated/prisma/client";

export const reviewListInclude = {
  call: { include: { _count: { select: { guardrailEvents: true } } } },
} as const satisfies Prisma.ReviewInclude;
