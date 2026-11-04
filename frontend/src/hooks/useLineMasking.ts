"use client";

import { useEffect, useRef, useState } from "react";
import { sendToBackend } from "@/lib/sendToBackend";
import type { LineMaskingResponse } from "@/types/LineMaskingResponse";
import type { LineMaskingResult } from "@/types/LineMaskingResult";
import type { LiveLine } from "@/types/LiveLine";

export function useLineMasking(lines: LiveLine[]): Map<number, LineMaskingResult> {
  const [results, setResults] = useState(new Map<number, LineMaskingResult>());
  const requestedRef = useRef(new Set<number>());

  useEffect(() => {
    const finishedCallerLines = lines.filter((line) => line.speaker === "caller" && line.isFinal && !requestedRef.current.has(line.id));
    for (const line of finishedCallerLines) {
      requestedRef.current.add(line.id);
      setResults((current) => new Map(current).set(line.id, { status: "checking", redactedText: "" }));
      sendToBackend<LineMaskingResponse>("POST", "/masking/line", { text: line.text })
        .then((result) => setResults((current) => new Map(current).set(line.id, { status: result.isChecked ? "checked" : "failed", redactedText: result.redactedText })))
        .catch(() => setResults((current) => new Map(current).set(line.id, { status: "failed", redactedText: "" })));
    }
  }, [lines]);

  return results;
}
