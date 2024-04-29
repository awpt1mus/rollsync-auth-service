import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { TokenService } from "./services/jwt.service";
import { PasswordService } from "./services/password.service";

@Module({
	imports: [DatabaseModule],
	providers: [TokenService, PasswordService, AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
