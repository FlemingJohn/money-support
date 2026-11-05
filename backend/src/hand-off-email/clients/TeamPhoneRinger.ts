export abstract class TeamPhoneRinger {
  abstract ring(teamPhone: string): Promise<void>;
}
