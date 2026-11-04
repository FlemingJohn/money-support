const descriptions: Record<string, string> = {
  "assistant-said-end-call-phrase": "Agent, after the hand-off sentence",
  "assistant-ended-call": "Agent",
  "customer-ended-call": "Caller",
  "assistant-forwarded-call": "Transferred to a person",
  "silence-timed-out": "Silence",
  "exceeded-max-duration": "Longest call time reached",
};

export function describeEndedReason(endedReason: string | null): string {
  if (!endedReason) return "—";
  return descriptions[endedReason] ?? endedReason.replaceAll("-", " ");
}
