import { Suspense } from "react";
import { PageLoading } from "@/components/PageLoading";
import { TestCallContent } from "@/test-call/TestCallContent";

export default function TestCallPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading the test call" />}>
      <TestCallContent />
    </Suspense>
  );
}
