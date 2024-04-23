import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { AppConfig } from "./config/config.types";
import { RootModule } from "./root/root.module";

async function bootstrap() {
	const app = await NestFactory.create(RootModule);
	const configService = app.get(ConfigService<AppConfig>);
	const port = configService.get<number>("port");
	await app.listen(port);
}
bootstrap();
