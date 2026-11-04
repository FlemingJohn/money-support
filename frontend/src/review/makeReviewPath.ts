import type { ReviewSelection } from "@/types/ReviewSelection";

export function makeReviewPath(selection: ReviewSelection): string {
  const query = new URLSearchParams();
  if (selection.status !== "open") query.set("status", selection.status);
  if (selection.callId) query.set("call", selection.callId);
  const queryText = query.toString();
  return queryText ? `/review?${queryText}` : "/review";
}
