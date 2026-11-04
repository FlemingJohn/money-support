import { Suspense } from "react";
import { PageLoading } from "@/components/PageLoading";
import { ReviewContent } from "@/review/ReviewContent";

export default function ReviewPage({ searchParams }: PageProps<"/review">) {
  return (
    <Suspense fallback={<PageLoading label="Loading the review queue" />}>
      <ReviewContent searchParams={searchParams} />
    </Suspense>
  );
}
