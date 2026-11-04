import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ActivityModule } from "../activity/ActivityModule";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { GmailHandOffMailer } from "./clients/GmailHandOffMailer";
import { HandOffMailer } from "./clients/HandOffMailer";
import { HandOffEmailBuilder } from "./services/HandOffEmailBuilder";
import { HandOffEmailService } from "./services/HandOffEmailService";
import { HandOffOutcomeResolver } from "./services/HandOffOutcomeResolver";
import { TeamHoursChecker } from "./services/TeamHoursChecker";

@Module({
  imports: [
    ActivityModule,
    ReviewModule,
    SettingsModule,
    MailerModule.forRootAsync({
      inject: [AppConfiguration],
      useFactory: (appConfiguration: AppConfiguration) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { user: appConfiguration.mailUser, pass: appConfiguration.mailAppPassword },
        },
        defaults: { from: `"Money Support Agent" <${appConfiguration.mailUser}>` },
        verifyTransporters: false,
      }),
    }),
  ],
  providers: [HandOffEmailBuilder, HandOffEmailService, HandOffOutcomeResolver, TeamHoursChecker, { provide: HandOffMailer, useClass: GmailHandOffMailer }],
  exports: [HandOffEmailService],
})
export class HandOffEmailModule {}
