import { Module } from "@nestjs/common";
import { connectionProvider } from "./connection.provider";
import { UserRepository } from "./repositories/user.repository";

@Module({
	providers: [connectionProvider, UserRepository],
	exports: [connectionProvider, UserRepository],
})
export class DatabaseModule {}
