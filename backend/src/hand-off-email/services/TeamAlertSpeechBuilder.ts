import { Injectable } from "@nestjs/common";

@Injectable()
export class TeamAlertSpeechBuilder {
  private readonly greeting = "Hi, this is the Wise voice agent.";
  private readonly followUp = "The details will be in your email and on the Review page.";

  makeDuringCall(reason: string, callerNeed: string): string {
    const need = callerNeed.trim() ? ` They need help with ${callerNeed.trim().replace(/[.!?]+$/, "")}.` : "";
    return `${this.greeting} A customer on the line ${reason}.${need} ${this.followUp}`;
  }

  makeAfterCall(): string {
    return `${this.greeting} A customer needs help. ${this.followUp}`;
  }
}
