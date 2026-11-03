import type { Prisma } from "../generated/prisma/client";
import type { reviewListInclude } from "./reviewListInclude";

export type ReviewWithCall = Prisma.ReviewGetPayload<{ include: typeof reviewListInclude }>;
