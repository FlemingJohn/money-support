import { Suspense } from "react";
import { CallDetailContent } from "@/calls/CallDetailContent";
import { PageLoading } from "@/components/PageLoading";

export default function CallDetailPage({ params }: PageProps<"/calls/[callId]">) {
  return (
    <Suspense fallback={<PageLoading label="Loading the call" />}>
      <CallDetailContent params={params} />
    </Suspense>
  );
}
