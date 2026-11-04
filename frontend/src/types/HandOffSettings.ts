export interface HandOffSettings {
  mode: "endCall" | "transfer";
  handOffSentence: string;
  transferNumber: string;
  teamHours: "weekdays" | "always";
  emailTeam: boolean;
  teamEmail: string;
}
