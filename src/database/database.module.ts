import { Module } from "@nestjs/common";
import { RefreshTokenRepository } from "./repositories/refresh.token.repository";
import { UserRepository } from "./repositories/user.repository";
import { DatabaseConnectionService } from "./services/connection.service";

@Module({
	providers: [
		DatabaseConnectionService,
		UserRepository,
		RefreshTokenRepository,
	],
	exports: [DatabaseConnectionService, UserRepository, RefreshTokenRepository],
})
export class DatabaseModule {}
