import { Suspense } from "react";
import { CallsContent } from "@/calls/CallsContent";
import { PageLoading } from "@/components/PageLoading";

export default function CallsPage({ searchParams }: PageProps<"/calls">) {
  return (
    <Suspense fallback={<PageLoading label="Loading calls" />}>
      <CallsContent searchParams={searchParams} />
    </Suspense>
  );
}
