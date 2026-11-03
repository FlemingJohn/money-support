import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfiguration } from "./AppConfiguration";
import { environmentSchema } from "./environmentSchema";

@Global()
@Module({
  imports: [ConfigModule.forRoot({ validate: (variables) => environmentSchema.parse(variables) })],
  providers: [AppConfiguration],
  exports: [AppConfiguration],
})
export class ConfigurationModule {}
