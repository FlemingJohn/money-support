import { BackendNotFoundError } from "@/lib/BackendNotFoundError";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function getFromBackend<Result>(path: string): Promise<Result> {
  const response = await fetch(`${backendUrl}${path}`, { cache: "no-store" });
  if (response.status === 404) throw new BackendNotFoundError(path);
  if (!response.ok) throw new Error(`The backend answered ${response.status} for ${path}`);
  return response.json();
}
