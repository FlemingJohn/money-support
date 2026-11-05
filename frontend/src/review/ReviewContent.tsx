import { Flag } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { getSettings } from "@/lib/getSettings";
import { getCallbacks } from "@/review/getCallbacks";
import { getReviewDetail } from "@/review/getReviewDetail";
import { findNextReviewPath } from "@/review/findNextReviewPath";
import { getReviewList } from "@/review/getReviewList";
import { readReviewSelection } from "@/review/readReviewSelection";
import { ReviewQueueList } from "@/review/ReviewQueueList";
import { ReviewStatusTabs } from "@/review/ReviewStatusTabs";
import { ReviewWorkspace } from "@/review/ReviewWorkspace";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

export async function ReviewContent({ searchParams }: SearchParamsProps) {
  const selection = readReviewSelection(await searchParams);
  const reviewList = await getReviewList(selection.status);
  const selectedCallId = selection.callId ?? reviewList.reviews[0]?.callId ?? null;
  const [detail, callbacks, settings] = selectedCallId
    ? await Promise.all([getReviewDetail(selectedCallId), getCallbacks(selectedCallId), getSettings()])
    : [null, [], null];

  return (
    <div className="flex flex-1 flex-wrap items-start gap-4">
      <section aria-label="Calls waiting for review" className="flex min-w-0 flex-[1_1_300px] flex-col rounded-card border border-line bg-paper lg:max-w-sm">
        <ReviewStatusTabs counts={reviewList.counts} selection={selection} />
        <ReviewQueueList reviews={reviewList.reviews} selection={selection} selectedCallId={selectedCallId} />
      </section>

      {detail && settings ? (
        <ReviewWorkspace detail={detail} callbacks={callbacks} phone={settings.phone} nextReviewPath={findNextReviewPath(reviewList, selection, selectedCallId)} />
      ) : (
        <section className="flex min-w-0 flex-[2_1_560px] flex-col items-center gap-3 rounded-card border border-line bg-paper p-10 text-center">
          <Flag size={24} strokeWidth={1.75} aria-hidden="true" className="text-ink-muted" />
          <EmptyState message={selectedCallId ? "This review no longer exists." : "Pick a call from the list to review it."} />
        </section>
      )}
    </div>
  );
}
