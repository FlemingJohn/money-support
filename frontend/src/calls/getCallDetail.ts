import { notFound } from "next/navigation";
import { BackendNotFoundError } from "@/lib/BackendNotFoundError";
import { getFromBackend } from "@/lib/getFromBackend";
import type { CallDetail } from "@/types/CallDetail";

export async function getCallDetail(callId: string): Promise<CallDetail> {
  try {
    return await getFromBackend<CallDetail>(`/calls/${encodeURIComponent(callId)}`);
  } catch (error) {
    if (error instanceof BackendNotFoundError) notFound();
    throw error;
  }
}
