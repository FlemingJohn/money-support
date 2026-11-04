import type { PrivacyToggle } from "@/types/PrivacyToggle";

export const privacyToggles: PrivacyToggle[] = [
  { key: "maskCardNumbers", label: "Mask card numbers", detail: "Removed from transcripts, and the agent never hears them." },
  { key: "maskBankAccountNumbers", label: "Mask bank account numbers", detail: "IBANs, account numbers and sort codes." },
  { key: "maskEmailAddresses", label: "Mask email addresses", detail: "Removed from transcripts before they are saved." },
  { key: "maskNames", label: "Mask names", detail: "Names the caller says are removed from transcripts." },
  { key: "keepNumbersForCallbacks", label: "Keep caller numbers for call backs", detail: "Stored encrypted, only for calls that need a review." },
  { key: "deleteVapiCopy", label: "Delete Vapi's copy of each call", detail: "Vapi's record is deleted once the call is saved here." },
  { key: "startInPrivacyMode", label: "Start the dashboard in privacy mode", detail: "Hides topics and numbers until you choose to show them." },
];
