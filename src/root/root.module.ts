import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/auth/auth.module";
import { LoggingMiddleware } from "src/logging/logging.middleware";
import loadConfig from "../config/config.loader";
import { RootController } from "./root.controller";
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
export class RootModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
