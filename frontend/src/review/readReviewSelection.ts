import type { ReviewSelection } from "@/types/ReviewSelection";
import type { ReviewStatus } from "@/types/ReviewStatus";

const statuses: ReviewStatus[] = ["open", "inProgress", "done"];

export function readReviewSelection(searchParams: Record<string, string | string[] | undefined>): ReviewSelection {
  const status = readFirst(searchParams.status);
  const callId = readFirst(searchParams.call);
  return { status: statuses.find((known) => known === status) ?? "open", callId: callId || null };
}

function readFirst(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
