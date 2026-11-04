import type { HttpMethod } from "@/types/HttpMethod";
import type { SavingState } from "@/types/SavingState";

export interface BackendChange {
  savingState: SavingState;
  errorMessage: string;
  send: <Result>(method: HttpMethod, path: string, body?: unknown) => Promise<Result | null>;
}
