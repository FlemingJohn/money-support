export abstract class TeamPhoneRinger {
  abstract ring(teamPhone: string, spokenAlert: string): Promise<void>;
}
