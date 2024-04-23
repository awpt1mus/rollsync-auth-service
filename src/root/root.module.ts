import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import loadConfig from "../config/config.loader";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === "production",
      envFilePath: ".env",
      isGlobal: true,
      load: [loadConfig],
    }),
  ],
})
export class RootModule {}
