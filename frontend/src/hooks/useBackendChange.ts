"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendToBackend } from "@/lib/sendToBackend";
import type { BackendChange } from "@/types/BackendChange";
import type { HttpMethod } from "@/types/HttpMethod";
import type { SavingState } from "@/types/SavingState";

export function useBackendChange(): BackendChange {
  const router = useRouter();
  const [savingState, setSavingState] = useState<SavingState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function send(method: HttpMethod, path: string, body?: unknown): Promise<boolean> {
    setSavingState("saving");
    setErrorMessage("");
    try {
      await sendToBackend(method, path, body);
      setSavingState("saved");
      router.refresh();
      return true;
    } catch (error) {
      setSavingState("failed");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      return false;
    }
  }

  return { savingState, errorMessage, send };
}
