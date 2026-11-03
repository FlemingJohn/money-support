import type { Prisma } from "../generated/prisma/client";
import type { callDetailInclude } from "./callDetailInclude";

export type CallWithDetails = Prisma.CallGetPayload<{ include: typeof callDetailInclude }>;
