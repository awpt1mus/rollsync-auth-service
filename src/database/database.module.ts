import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { DatabaseConnectionService } from "./services/connection.service";

@Module({
	providers: [DatabaseConnectionService, UserRepository],
	exports: [DatabaseConnectionService, UserRepository],
})
export class DatabaseModule {}
