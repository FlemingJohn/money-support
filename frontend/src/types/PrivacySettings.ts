export interface PrivacySettings {
  maskCardNumbers: boolean;
  maskBankAccountNumbers: boolean;
  maskEmailAddresses: boolean;
  maskNames: boolean;
  keepNumbersForCallbacks: boolean;
  deleteVapiCopy: boolean;
  startInPrivacyMode: boolean;
  transcriptRetentionDays: 7 | 30 | 90;
}
