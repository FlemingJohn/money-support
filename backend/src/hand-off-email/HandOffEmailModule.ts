import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ActivityModule } from "../activity/ActivityModule";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { GmailHandOffMailer } from "./clients/GmailHandOffMailer";
import { HandOffMailer } from "./clients/HandOffMailer";
import { SkippedTeamPhoneRinger } from "./clients/SkippedTeamPhoneRinger";
import { TeamPhoneRinger } from "./clients/TeamPhoneRinger";
import { TwilioTeamPhoneRinger } from "./clients/TwilioTeamPhoneRinger";
import { HandOffRingController } from "./controllers/HandOffRingController";
import { HandOffAlertService } from "./services/HandOffAlertService";
import { HandOffEmailBuilder } from "./services/HandOffEmailBuilder";
import { HandOffOutcomeResolver } from "./services/HandOffOutcomeResolver";
import { HandOffRingService } from "./services/HandOffRingService";
import { TeamAlertSpeechBuilder } from "./services/TeamAlertSpeechBuilder";
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
  controllers: [HandOffRingController],
  providers: [
    HandOffAlertService,
    HandOffRingService,
    TeamAlertSpeechBuilder,
    HandOffEmailBuilder,
    HandOffOutcomeResolver,
    TeamHoursChecker,
    { provide: HandOffMailer, useClass: GmailHandOffMailer },
    {
      provide: TeamPhoneRinger,
      inject: [AppConfiguration],
      useFactory: (appConfiguration: AppConfiguration) =>
        appConfiguration.isTwilioConfigured ? new TwilioTeamPhoneRinger(appConfiguration) : new SkippedTeamPhoneRinger(),
    },
  ],
  exports: [HandOffAlertService],
})
export class HandOffEmailModule {}
