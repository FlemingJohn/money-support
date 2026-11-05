import twilio, { type Twilio } from "twilio";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { TeamPhoneRinger } from "./TeamPhoneRinger";

export class TwilioTeamPhoneRinger extends TeamPhoneRinger {
  private readonly spokenAlert = "Hi, this is the Wise voice agent. A customer needs help. The details are in your email and on the Review page.";
  private readonly client: Twilio;

  constructor(private readonly appConfiguration: AppConfiguration) {
    super();
    this.client = twilio(appConfiguration.twilioAccountSid, appConfiguration.twilioAuthToken);
  }

  async ring(teamPhone: string): Promise<void> {
    const instructions = new twilio.twiml.VoiceResponse();
    instructions.say({ voice: "Polly.Amy" }, this.spokenAlert);
    await this.client.calls.create({ to: teamPhone, from: this.appConfiguration.twilioCallerNumber, twiml: instructions.toString() });
  }
}
