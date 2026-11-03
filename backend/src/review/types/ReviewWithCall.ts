import type { Prisma } from "../../generated/prisma/client";
import type { reviewListInclude } from "../queries/reviewListInclude";

export type ReviewWithCall = Prisma.ReviewGetPayload<{ include: typeof reviewListInclude }>;
