import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { connectionProvider } from "./connection.provider";

@Module({
  providers: [connectionProvider, UserRepository],
  exports: [connectionProvider, UserRepository],
})
export class DatabaseModule {}
