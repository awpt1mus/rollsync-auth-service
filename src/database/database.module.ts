import { Module } from "@nestjs/common";
import { DatabaseConnectionService } from "./connection.service";
import { UserRepository } from "./repositories/user.repository";

@Module({
	providers: [DatabaseConnectionService, UserRepository],
	exports: [DatabaseConnectionService, UserRepository],
})
export class DatabaseModule {}
