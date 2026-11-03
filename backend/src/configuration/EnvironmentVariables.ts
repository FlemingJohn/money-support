import type { z } from "zod";
import type { environmentSchema } from "./environmentSchema";

export type EnvironmentVariables = z.infer<typeof environmentSchema>;
