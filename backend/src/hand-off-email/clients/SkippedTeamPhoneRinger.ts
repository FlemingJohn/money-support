import { Logger } from "@nestjs/common";
import { TeamPhoneRinger } from "./TeamPhoneRinger";

export class SkippedTeamPhoneRinger extends TeamPhoneRinger {
  private readonly logger = new Logger(SkippedTeamPhoneRinger.name);

  async ring(): Promise<void> {
    this.logger.warn("Twilio is not configured, so the team phone was not rung");
  }
}
