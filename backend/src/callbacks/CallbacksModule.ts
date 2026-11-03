import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { Clock } from "../common/services/Clock";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { CallbackController } from "./controllers/CallbackController";
import { CallbackPresenter } from "./presenters/CallbackPresenter";
import { CallbackRepository } from "./repositories/CallbackRepository";
import { CallbackService } from "./services/CallbackService";
import { OutboundCallClient } from "./clients/OutboundCallClient";
import { SimulatedBridgeClient } from "./clients/SimulatedBridgeClient";
import { TwilioBridgeClient } from "./clients/TwilioBridgeClient";

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
