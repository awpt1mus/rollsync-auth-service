import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { DatabaseConnectionService } from "./services/connection.service";
import { RefreshTokenRepository } from "./repositories/refresh.token.repository";

@Module({
	providers: [
		DatabaseConnectionService,
		UserRepository,
		RefreshTokenRepository,
	],
	exports: [DatabaseConnectionService, UserRepository, RefreshTokenRepository],
})
export class DatabaseModule {}
