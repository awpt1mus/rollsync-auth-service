import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { AppConfig } from "./config/config.types";
import { RootModule } from "./root/root.module";

async function bootstrap() {
	const app = await NestFactory.create(RootModule);
	const configService = app.get(ConfigService<AppConfig>);

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const swaggerConfig = new DocumentBuilder()
		.setTitle("rollsync-auth-service")
		.setDescription("authentication service for rollsync app")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup("docs", app, document);

	const port = configService.get<number>("port");
	await app.listen(port);
}
bootstrap();
