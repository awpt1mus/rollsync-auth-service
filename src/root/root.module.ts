import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import loadConfig from "../config/config.loader";
import { RootController } from "./root.controller";
import { AuthModule } from "src/auth/auth.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === "production",
      envFilePath: ".env",
      isGlobal: true,
      load: [loadConfig],
    }),
    AuthModule,
  ],
  controllers: [RootController],
})
export class RootModule {}
