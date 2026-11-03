import type { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";
import { AppConfiguration } from "./configuration/services/AppConfiguration";

export class ApplicationServer {
  constructor(private readonly nestFactory: typeof NestFactory) {}

  async start(): Promise<void> {
    const application = await this.nestFactory.create(AppModule);
    const appConfiguration = application.get(AppConfiguration);
    application.enableCors({ origin: appConfiguration.frontendOrigin });
    application.enableShutdownHooks();
    await application.listen(appConfiguration.port);
  }
}
