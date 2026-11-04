import type { Overview } from "@/types/Overview";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function getOverview(): Promise<Overview> {
  const response = await fetch(`${backendUrl}/overview`, { cache: "no-store" });
  if (!response.ok) throw new Error(`The backend answered ${response.status} for the overview`);
  return response.json();
}
