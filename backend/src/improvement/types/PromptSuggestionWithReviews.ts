import type { Prisma } from "../../generated/prisma/client";

export type PromptSuggestionWithReviews = Prisma.PromptSuggestionGetPayload<{ include: { reviews: true } }>;
