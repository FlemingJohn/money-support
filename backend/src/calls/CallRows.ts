import type { Call } from "../generated/prisma/client";

export interface CallRows {
  calls: Call[];
  total: number;
}
