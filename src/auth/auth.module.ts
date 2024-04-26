import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenService } from "./jwt.service";
import { PasswordService } from "./password.service";

@Module({
	imports: [DatabaseModule],
	providers: [TokenService, PasswordService, AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
