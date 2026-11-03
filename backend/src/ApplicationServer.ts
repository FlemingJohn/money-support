import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";
import { AppConfiguration } from "./configuration/services/AppConfiguration";

export class ApplicationServer {
  async start(): Promise<void> {
    const application = await NestFactory.create(AppModule);
    const appConfiguration = application.get(AppConfiguration);
    application.enableCors({ origin: appConfiguration.frontendOrigin });
    application.enableShutdownHooks();
    await application.listen(appConfiguration.port);
  }
}
