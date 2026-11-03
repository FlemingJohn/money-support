import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { Clock } from "../common/Clock";
import { AppConfiguration } from "../configuration/AppConfiguration";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { CallbackController } from "./CallbackController";
import { CallbackPresenter } from "./CallbackPresenter";
import { CallbackRepository } from "./CallbackRepository";
import { CallbackService } from "./CallbackService";
import { OutboundCallClient } from "./OutboundCallClient";
import { SimulatedBridgeClient } from "./SimulatedBridgeClient";
import { TwilioBridgeClient } from "./TwilioBridgeClient";

@Module({
  imports: [ActivityModule, CallsModule, ReviewModule, SettingsModule],
  controllers: [CallbackController],
  providers: [
    CallbackPresenter,
    CallbackRepository,
    CallbackService,
    {
      provide: OutboundCallClient,
      inject: [AppConfiguration, Clock],
      useFactory: (appConfiguration: AppConfiguration, clock: Clock) =>
        appConfiguration.isTwilioConfigured ? new TwilioBridgeClient(appConfiguration) : new SimulatedBridgeClient(clock),
    },
  ],
})
export class CallbacksModule {}
