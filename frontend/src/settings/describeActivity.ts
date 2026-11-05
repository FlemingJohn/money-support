const descriptions: Record<string, string> = {
  callCompleted: "Call answered by the agent",
  callHandedOff: "Call handed off",
  personalDataRemoved: "Personal data removed",
  transcriptViewed: "Transcript viewed",
  unmaskedDataReported: "Unmasked data reported",
  reviewUpdated: "Review updated",
  reviewVerdictSaved: "Verdict saved",
  reviewResolved: "Review resolved",
  callbackStarted: "Call back started",
  callbackEnded: "Call back ended",
  faqCreated: "FAQ added",
  faqUpdated: "FAQ changed",
  faqDeleted: "FAQ deleted",
  faqsReordered: "FAQs reordered",
  agentSynced: "Agent updated",
  agentSyncFailed: "Agent update failed",
  settingsUpdated: "Settings changed",
  handOffEmailSent: "Hand-off emailed to the team",
  handOffEmailFailed: "Hand-off email failed",
  callReanalysed: "Call re-analysed after a report",
  maskingMissRecorded: "Masking miss recorded",
  reviewTestCreated: "Test created from a review",
  reviewTestsRun: "Agent tests run",
  suggestionCreated: "Improvement suggested",
  suggestionApproved: "Improvement approved",
  suggestionRejected: "Improvement rejected",
  promptRuleToggled: "Learned rule switched",
};

export function describeActivity(action: string): string {
  return descriptions[action] ?? action;
}
