import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "src/database/database.module";
import { UserRepository } from "src/database/repositories/user.repository";
import { PasswordService } from "./password.service";
import { TokenService } from "./jwt.service";

@Module({
  imports: [DatabaseModule],
  providers: [TokenService, PasswordService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
