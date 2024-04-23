import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import loadConfig from "../config/config.loader";
import { connectionProvider } from "../database/connection.provider";
import { RootController } from "./root.controller";

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: process.env.NODE_ENV === "production",
			envFilePath: ".env",
			isGlobal: true,
			load: [loadConfig],
		}),
	],
	providers: [connectionProvider],
	controllers: [RootController],
})
export class RootModule {}
