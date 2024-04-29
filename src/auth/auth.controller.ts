import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "src/root/dtos/application.exception";
import { ApplicationErrorResponse } from "src/root/dtos/error.response.dto";
import { GlobalExceptionFilter } from "src/root/global.exception.filter";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { LoginSuccessDto } from "./dtos/login.success.dto";
import { RegisterDto } from "./dtos/register.dto";
@Controller("auth")
@ApiTags("auth")
@UseFilters(GlobalExceptionFilter)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/login")
	@ApiResponse({
		status: 401,
		description: "authentication failed",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: "invalid email or password etc",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 200,
		description: "login success",
		type: LoginSuccessDto,
	})
	@HttpCode(200)
	async handleTraditionalLogin(@Body() body: LoginDto) {
		const result = await this.authService.verifyLogin(body);
		return result;
	}

	@Post("/register")
	@ApiResponse({
		status: 400,
		description: "invalid request body provided",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 201,
		description: "successfully signed up",
	})
	@ApiResponse({
		status: 409,
		description: "Conflict",
		type: ApplicationErrorResponse,
	})
	async handleTraditionalSignUp(@Body() body: RegisterDto) {
		const result = await this.authService.registerUser(body);

		if (!result) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_SIGNUP_FAILED,
				500,
			);
		}
	}
}
