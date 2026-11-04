"use client";

import { useEffect, useRef, useState } from "react";
import type Vapi from "@vapi-ai/web";
import { checkMicrophoneAccess } from "@/lib/checkMicrophoneAccess";
import { readCallErrorMessage } from "@/lib/readCallErrorMessage";
import { addTranscript } from "@/test-call/addTranscript";
import { isTranscriptMessage } from "@/test-call/isTranscriptMessage";
import type { LiveLine } from "@/types/LiveLine";
import type { TestCall } from "@/types/TestCall";
import type { TestCallSetup } from "@/types/TestCallSetup";
import type { TestCallStatus } from "@/types/TestCallStatus";

export function useTestCall(setup: TestCallSetup): TestCall {
  const vapiRef = useRef<Vapi | null>(null);
  const startedAtRef = useRef(0);
  const [status, setStatus] = useState<TestCallStatus>("idle");
  const [lines, setLines] = useState<LiveLine[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status !== "live") return;
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)), 500);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => () => void vapiRef.current?.stop(), []);

  async function start() {
    setStatus("connecting");
    setLines([]);
    setSeconds(0);
    setErrorMessage("");
    const microphoneProblem = await checkMicrophoneAccess();
    if (microphoneProblem) return showFailure(microphoneProblem);
    await endPreviousCall();
    const vapi = await makeVapi();
    await vapi.start(setup.assistantId).catch(fail);
  }

  async function makeVapi(): Promise<Vapi> {
    const { default: VapiClient } = await import("@vapi-ai/web");
    const vapi = new VapiClient(setup.publicKey);
    vapi.on("call-start", () => {
      startedAtRef.current = Date.now();
      setStatus("live");
    });
    vapi.on("call-end", () => setStatus((current) => (current === "failed" ? current : "ended")));
    vapi.on("volume-level", setVolume);
    vapi.on("error", fail);
    vapi.on("message", (message: unknown) => {
      if (!isTranscriptMessage(message)) return;
      const secondsFromStart = (Date.now() - startedAtRef.current) / 1000;
      setLines((current) => addTranscript(current, message, secondsFromStart));
    });
    vapiRef.current = vapi;
    return vapi;
  }

  async function endPreviousCall() {
    const previous = vapiRef.current;
    vapiRef.current = null;
    previous?.removeAllListeners();
    await previous?.stop().catch(() => undefined);
  }

  function fail(error: unknown) {
    console.error("Test call failed", error);
    showFailure(readCallErrorMessage(error));
  }

  function showFailure(message: string) {
    setStatus("failed");
    setErrorMessage(message);
  }

  function toggleMute() {
    const vapi = vapiRef.current;
    if (!vapi) return;
    vapi.setMuted(!vapi.isMuted());
    setIsMuted(vapi.isMuted());
  }

  return { status, lines, isMuted, volume, seconds, errorMessage, start, stop: async () => vapiRef.current?.stop(), toggleMute };
}
