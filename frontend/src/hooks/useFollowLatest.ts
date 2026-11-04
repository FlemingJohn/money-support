"use client";

import { useEffect, useRef } from "react";
import type { FollowLatest } from "@/types/FollowLatest";

const nearBottomPixels = 48;

export function useFollowLatest(itemCount: number): FollowLatest {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFollowingRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (container && isFollowingRef.current) container.scrollTop = container.scrollHeight;
  }, [itemCount]);

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    isFollowingRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < nearBottomPixels;
  }

  return { containerRef, handleScroll };
}
