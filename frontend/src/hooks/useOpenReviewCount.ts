"use client";

import { useEffect, useState } from "react";
import type { ReviewList } from "@/types/ReviewList";

export function useOpenReviewCount(): number | undefined {
  const [openReviewCount, setOpenReviewCount] = useState<number>();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reviews?status=open", { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<ReviewList>) : null))
      .then((reviewList) => setOpenReviewCount(reviewList?.reviews.length))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return openReviewCount;
}
