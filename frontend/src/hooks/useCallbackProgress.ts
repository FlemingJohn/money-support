"use client";

import { useEffect, useState } from "react";
import { sendToBackend } from "@/lib/sendToBackend";
import type { Callback } from "@/types/Callback";
import type { CallbackProgress } from "@/types/CallbackProgress";
import type { RingPhone } from "@/types/RingPhone";

const refreshMilliseconds = 2000;

export function useCallbackProgress(callId: string): CallbackProgress {
  const [callback, setCallback] = useState<Callback | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const isFinished = callback?.status === "ended" || callback?.status === "failed";

  useEffect(() => {
    if (!callback || isFinished) return;
    const timer = window.setInterval(() => {
      fetch(`/api/callbacks/${callback.id}`)
        .then((response) => (response.ok ? (response.json() as Promise<Callback>) : null))
        .then((latest) => latest && setCallback(latest))
        .catch(() => undefined);
    }, refreshMilliseconds);
    return () => window.clearInterval(timer);
  }, [callback, isFinished]);

  async function start(ringPhone: RingPhone) {
    setErrorMessage("");
    try {
      setCallback(await sendToBackend<Callback>("POST", `/reviews/${encodeURIComponent(callId)}/callbacks`, { ringPhone }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The call back could not start");
    }
  }

  async function end() {
    if (!callback) return;
    try {
      setCallback(await sendToBackend<Callback>("POST", `/callbacks/${callback.id}/end`));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The call back could not end");
    }
  }

  return { callback, errorMessage, start, end };
}
