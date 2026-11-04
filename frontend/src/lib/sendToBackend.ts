import type { HttpMethod } from "@/types/HttpMethod";

export async function sendToBackend<Result>(method: HttpMethod, path: string, body?: unknown): Promise<Result> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.status === 204 ? (undefined as Result) : response.json();
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  const validationMessages = Array.isArray(body?.errors) ? body.errors.map((error: { message?: string }) => error.message).filter(Boolean) : [];
  if (validationMessages.length > 0) return validationMessages.join(", ");
  const message = body?.message;
  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string" ? message : `The backend answered ${response.status}`;
}
