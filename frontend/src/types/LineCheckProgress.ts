export interface LineCheckProgress {
  firstSeenAt: number;
  lastSentAt: number;
  lastSentText: string;
  finalSentText: string;
  isInFlight: boolean;
  sentCount: number;
  appliedCount: number;
}
