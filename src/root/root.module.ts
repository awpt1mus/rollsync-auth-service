import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RootController } from './root.controller';
import loadConfig from "../config/config.loader";
import {connectionProvider} from "../database/connection.provider";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === "production",
      envFilePath: ".env",
      isGlobal: true,
      load: [loadConfig],
    }),
  ],
  providers: [
    connectionProvider
  ],
  controllers: [RootController],
})
export class RootModule {}
