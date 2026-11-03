import type { ReviewStatus } from "../../generated/prisma/client";

export type ReviewCounts = Record<ReviewStatus, number>;
