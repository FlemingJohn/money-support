import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import type { HandOffEmail } from "../types/HandOffEmail";
import { HandOffMailer } from "./HandOffMailer";

@Injectable()
export class GmailHandOffMailer extends HandOffMailer {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async send(email: HandOffEmail): Promise<void> {
    await this.mailerService.sendMail({ to: email.to, subject: email.subject, text: email.text, html: email.html });
  }
}
