import { BackendNotFoundError } from "@/lib/BackendNotFoundError";
import { getFromBackend } from "@/lib/getFromBackend";
import type { ReviewDetail } from "@/types/ReviewDetail";

export async function getReviewDetail(callId: string): Promise<ReviewDetail | null> {
  try {
    return await getFromBackend<ReviewDetail>(`/reviews/${encodeURIComponent(callId)}`);
  } catch (error) {
    if (error instanceof BackendNotFoundError) return null;
    throw error;
  }
}
