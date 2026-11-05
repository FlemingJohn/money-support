import type { Prisma } from "../../generated/prisma/client";

export type JudgedReview = Prisma.ReviewGetPayload<{ include: { call: { include: { promptVersion: true } } } }>;
