"use client";

import { useState } from "react";
import Link from "next/link";
import { FlaskConical, ThumbsDown, ThumbsUp } from "lucide-react";
import { useBackendChange } from "@/hooks/useBackendChange";
import { WrongVerdictDetails } from "@/review/WrongVerdictDetails";
import type { VerdictFormProps } from "@/types/VerdictFormProps";
import type { VerdictReason } from "@/types/VerdictReason";

export function VerdictForm({ review, agentReplies }: VerdictFormProps) {
  const { savingState, errorMessage, send } = useBackendChange();
  const [isWrongOpen, setIsWrongOpen] = useState(review.verdict === "wrong");
  const [verdictReason, setVerdictReason] = useState<VerdictReason>(review.verdictReason ?? "shouldHaveAnswered");
  const [expectedBehaviour, setExpectedBehaviour] = useState(review.expectedBehaviour ?? "");
  const [verdictMessageId, setVerdictMessageId] = useState(review.verdictMessageId ?? agentReplies.at(-1)?.id ?? "");
  const verdictPath = `/reviews/${encodeURIComponent(review.callId)}/verdict`;
  const isCorrect = review.verdict === "correct" && !isWrongOpen;
  const isWrong = review.verdict === "wrong" || isWrongOpen;

  function markCorrect() {
    setIsWrongOpen(false);
    send("PUT", verdictPath, { verdict: "correct" });
  }

  function saveWrong() {
    send("PUT", verdictPath, { verdict: "wrong", verdictReason, expectedBehaviour: expectedBehaviour.trim() || undefined, verdictMessageId: verdictMessageId || undefined });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span id="verdict-label" className="text-sm font-semibold">
          Did the agent handle this call correctly?
        </span>
        <div role="group" aria-labelledby="verdict-label" className="flex gap-2">
          <button type="button" aria-pressed={isCorrect} onClick={markCorrect} className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-sm font-semibold ${isCorrect ? "border-success bg-success-wash text-success-ink" : "border-line hover:bg-surface"}`}>
            <ThumbsUp size={16} strokeWidth={2} aria-hidden="true" />
            Correct
          </button>
          <button type="button" aria-pressed={isWrong} onClick={() => setIsWrongOpen(true)} className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-sm font-semibold ${isWrong ? "border-handoff-ink bg-handoff-wash text-handoff-ink" : "border-line hover:bg-surface"}`}>
            <ThumbsDown size={16} strokeWidth={2} aria-hidden="true" />
            Wrong
          </button>
        </div>
      </div>
      {isWrongOpen && (
        <WrongVerdictDetails
          verdictReason={verdictReason}
          agentReplies={agentReplies}
          verdictMessageId={verdictMessageId}
          onReplyChange={setVerdictMessageId}
          expectedBehaviour={expectedBehaviour}
          isSaving={savingState === "saving"}
          onReasonChange={setVerdictReason}
          onExpectedBehaviourChange={setExpectedBehaviour}
          onSave={saveWrong}
        />
      )}
      {review.reviewTestNumber !== null && (
        <Link href="/agent-quality?tab=tests" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-success-ink hover:underline">
          <FlaskConical size={16} strokeWidth={2} aria-hidden="true" />
          This mistake is now test R{String(review.reviewTestNumber).padStart(2, "0")}, run before every agent change
        </Link>
      )}
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
    </div>
  );
}
