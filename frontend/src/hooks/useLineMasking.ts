"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isLineCheckDue } from "@/lib/isLineCheckDue";
import { dueCheckIntervalMilliseconds } from "@/lib/liveMaskingTimings";
import { sendToBackend } from "@/lib/sendToBackend";
import type { LineCheckProgress } from "@/types/LineCheckProgress";
import type { LineMaskingResponse } from "@/types/LineMaskingResponse";
import type { LineMaskingResult } from "@/types/LineMaskingResult";
import type { LiveLine } from "@/types/LiveLine";

export function useLineMasking(lines: LiveLine[]): Map<number, LineMaskingResult> {
  const [results, setResults] = useState(new Map<number, LineMaskingResult>());
  const linesRef = useRef(lines);
  const progressRef = useRef(new Map<number, LineCheckProgress>());

  const sendCheck = useCallback(async (line: LiveLine, progress: LineCheckProgress) => {
    const sentNumber = progress.sentCount + 1;
    Object.assign(progress, { isInFlight: true, sentCount: sentNumber, lastSentText: line.text, lastSentAt: Date.now() });
    if (line.isFinal) progress.finalSentText = line.text;
    const result = await sendToBackend<LineMaskingResponse>("POST", "/masking/line", { text: line.text }).catch(() => null);
    progress.isInFlight = false;
    if (sentNumber <= progress.appliedCount) return;
    progress.appliedCount = sentNumber;
    setResults((current) => new Map(current).set(line.id, toResult(line, result, current.get(line.id))));
  }, []);

  const checkDueLines = useCallback(() => {
    const now = Date.now();
    for (const line of linesRef.current.filter((candidate) => candidate.speaker === "caller")) {
      const progress = progressRef.current.get(line.id) ?? makeProgress(now);
      progressRef.current.set(line.id, progress);
      if (isLineCheckDue(line, progress, now)) void sendCheck(line, progress);
    }
  }, [sendCheck]);

  useEffect(() => {
    linesRef.current = lines;
    checkDueLines();
  }, [lines, checkDueLines]);

  useEffect(() => {
    const timer = window.setInterval(checkDueLines, dueCheckIntervalMilliseconds);
    return () => window.clearInterval(timer);
  }, [checkDueLines]);

  return results;
}

function makeProgress(now: number): LineCheckProgress {
  return { firstSeenAt: now, lastSentAt: 0, lastSentText: "", finalSentText: "", isInFlight: false, sentCount: 0, appliedCount: 0 };
}

function toResult(line: LiveLine, response: LineMaskingResponse | null, previous: LineMaskingResult | undefined): LineMaskingResult {
  if (response?.isChecked) return { status: line.isFinal ? "checked" : "partial", redactedText: response.redactedText };
  if (line.isFinal) return { status: "failed", redactedText: "" };
  return previous ?? { status: "partial", redactedText: "" };
}
